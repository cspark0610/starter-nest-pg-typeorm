import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SERVICES } from '../emails/config';
import { UsersRepository } from './users.repository';

import { EmailsModule } from '../emails/emails.module';
import { OrganizationModule } from '../organization/organization.module';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';

import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    OrganizationModule,
    EmailsModule.register({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      from: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
      service: process.env.MAIL_SERVICE as SERVICES,
      cc: process.env.MAIL_CC,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
