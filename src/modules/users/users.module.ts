import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationRepository } from '../organization/organization.repository';
import { UsersRepository } from './users.repository';

import { OrganizationModule } from '../organization/organization.module';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';

import { Organization } from '../organization/entities/organization.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organization]),
    EventEmitterModule.forRoot(),
    OrganizationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, OrganizationRepository],
})
export class UsersModule {}
