import { ConflictException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import async = require('async');
import { UsersRepository } from './users.repository';

import { EmailsService } from '../emails/emails.service';
import { OrganizationService } from '../organization/organization.service';

import { User } from './entities/user.entity';

import { ReceiverDto } from '../emails/dto/receiver.dto';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  default_receiver = 'devsmartcore@outlook.com';

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly organizationService: OrganizationService,
    private readonly emailsService: EmailsService,
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
    const adminReceivers = [{ email: this.default_receiver }];
    const clientReceivers = [{ email: user.email }];
    if (user) {
      this.sendEmails(clientReceivers, adminReceivers, user);
      return {
        user,
        message: `Emails sent to ${user.email} and ${this.default_receiver} and user tenant created successfully`,
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
  private sendEmails(
    clientsReceivers: ReceiverDto[],
    adminReceivers: ReceiverDto[],
    user: User,
  ) {
    const promisesFuncArray = [
      async () =>
        this.emailsService.sendEmail(
          adminReceivers,
          {
            name: user.name,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            organization: user.organization,
            subdomain: user.organization.subdomain,
            aws_s3_bucket: user.organization.aws_s3_bucket,
          },
          'register',
        ),
      async () =>
        this.emailsService.sendEmail(
          clientsReceivers,
          {
            name: user.name,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            organization: user.organization,
          },
          'welcome',
        ),
    ];

    async.parallel(promisesFuncArray);
  }
}
