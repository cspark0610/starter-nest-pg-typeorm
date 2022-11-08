import { ConflictException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

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
  ) {}

  async create(userDto: UserDto) {
    await this.validateIfEmailsExists(userDto.email);
    await this.validateSubdomain(userDto.organization.subdomain);

    const user = {
      ...userDto,
      organization: {
        ...userDto.organization,
        aws_s3_bucket: v4(),
      },
    };
    return this.usersRepository.createSingle(user as Partial<User>);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findOne(id: number) {
    return this.usersRepository.findOneById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.updateSingle(
      id,
      updateUserDto as Partial<User>,
    );
  }

  remove(id: number) {
    return this.usersRepository.deleteSingle(id);
  }

  /* ========= VALIDATIONS ========= */
  private async validateIfEmailsExists(email: string): Promise<void> {
    const emailExists = await this.usersRepository.findOneBy({ email });
    if (emailExists) throw new ConflictException(`User already exists`);
  }

  private async validateSubdomain(subdomain: string): Promise<void> {
    const exists = await this.organizationService.findOneBySubdomain(subdomain);
    if (exists) throw new ConflictException(`Subdomain already exists`);
  }
}
