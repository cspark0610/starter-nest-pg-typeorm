import { Organization } from '~/modules/organization/entities/organization.entity';

export class AdminPayload {
  constructor(
    public readonly name: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly email: string,
    public readonly organization: Organization,
    public readonly subdomain: string,
    public readonly aws_s3_bucket: string,
  ) {}
}
