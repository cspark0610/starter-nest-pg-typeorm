import { Injectable } from '@nestjs/common';

import { OrganizationRepository } from './organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    protected readonly organizationRepository: OrganizationRepository,
  ) {}

  findAll() {
    return this.organizationRepository.findAll();
  }

  async findOneBySubdomain(subdomain: string) {
    return this.organizationRepository.findOneBy({ subdomain });
  }
}
