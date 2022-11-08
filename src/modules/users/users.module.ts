import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersRepository } from './users.repository';

import { OrganizationModule } from '../organization/organization.module';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';

import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OrganizationModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
