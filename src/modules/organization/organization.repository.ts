import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectRepository(Organization)
    private readonly repository: Repository<Organization>,
  ) {}

  getQueryBuilder(): SelectQueryBuilder<Organization> {
    return this.repository.createQueryBuilder('organization');
  }

  findAll(where: Partial<Organization> = {}): Promise<Array<Organization>> {
    return this.getQueryBuilder().where(where).getMany();
  }

  findOneBy(where: Partial<Organization> = {}): Promise<Organization> {
    const { subdomain } = where;
    return this.repository.findOne({ subdomain });
  }
}
