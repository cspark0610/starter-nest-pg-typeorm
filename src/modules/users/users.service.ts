import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 } from 'uuid';

import { To } from '../emails/enum';
import { AdminPayload, ClientPayload } from './payloads';
import { UsersRepository } from './users.repository';

import { OrganizationService } from '../organization/organization.service';

import { User } from './entities/user.entity';

import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly organizationService: OrganizationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(userDto: UserDto) {
    await this.validateIfEmailsExists(userDto.email);
    await this.validateSubdomain(userDto.organization.subdomain);

    const body = {
      ...userDto,
      organization: {
        ...userDto.organization,
        aws_s3_bucket: v4(),
      },
    };
    const user = await this.usersRepository.createSingle(body as Partial<User>);
    if (user) {
      this.emitEmailEvents(user);
      return {
        user,
        message: `Emails sent to ${user.email} and smartcore admin and user tenant created successfully`,
      };
    }
    return {
      message: 'Something went wrong',
      user: null,
    };
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneById(id);
    if (!user) throw new ConflictException(`User with id: ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.validateUserExistsById(id);
    return this.usersRepository.updateSingle(
      id,
      updateUserDto as Partial<User>,
    );
  }

  async remove(id: number) {
    await this.validateUserExistsById(id);
    return this.usersRepository.deleteUserAndOrganization(id);
  }

  /* ========= VALIDATIONS ========= */
  private async validateUserExistsById(id: number): Promise<void> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) throw new ConflictException(`User with id: ${id} not found`);
  }

  private async validateIfEmailsExists(email: string): Promise<void> {
    const emailExists = await this.usersRepository.findOneBy({ email });
    if (emailExists) throw new ConflictException(`User already exists`);
  }

  private async validateSubdomain(subdomain: string): Promise<void> {
    const exists = await this.organizationService.findOneBySubdomain(subdomain);
    if (exists) throw new ConflictException(`Subdomain already exists`);
  }

  /* ========= HELPERS ========= */
  private emitEmailEvents(user: User) {
    try {
      this.eventEmitter.emit(
        To.ADMIN,
        new AdminPayload(
          user.name,
          user.lastName,
          user.phone,
          user.email,
          user.organization,
          user.organization.subdomain,
          user.organization.aws_s3_bucket,
        ),
      );

      this.eventEmitter.emit(
        To.CLIENT,
        new ClientPayload(
          user.name,
          user.lastName,
          user.phone,
          user.email,
          user.organization,
        ),
      );
    } catch (e) {
      throw new InternalServerErrorException(JSON.stringify(e));
    }
  }
}
