import { EntityRepository, SelectQueryBuilder } from 'typeorm';

import { BaseRepository } from '~/common/repositories/base.repository';

import { Organization } from './entities/organization.entity';

@EntityRepository(Organization)
export class OrganizationRepository extends BaseRepository<Organization> {}
