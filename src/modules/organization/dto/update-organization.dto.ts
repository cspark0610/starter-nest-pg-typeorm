import { PartialType } from '@nestjs/mapped-types';

import { OrganizationDto } from './create-organization.dto';

export class UpdateOrganizationDto extends PartialType(OrganizationDto) {}
