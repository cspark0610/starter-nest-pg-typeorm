import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationRepository } from './organization.repository';

import { OrganizationService } from './organization.service';

import { Organization } from './entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [],
  providers: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}
