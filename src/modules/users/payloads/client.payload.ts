import { Organization } from '~/modules/organization/entities/organization.entity';

export class ClientPayload {
  constructor(
    public readonly name: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly organization: Organization,
  ) {}
}
