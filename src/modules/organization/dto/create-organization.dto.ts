import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrganizationDto {
  @ApiProperty({
    name: 'subdomain',
    type: String,
    required: true,
    description: 'Nombre del subdominio de la organizacion',
  })
  @IsString()
  @IsNotEmpty()
  subdomain!: string;
}
