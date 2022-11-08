import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { OrganizationDto } from '~/modules/organization/dto/create-organization.dto';

export class UserDto {
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    description: 'Nombre del usuario',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    name: 'lastName',
    type: String,
    required: true,
    description: 'Apellido del usuario',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
    description: 'Email del usuario',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    name: 'password',
    type: String,
    required: true,
    description: 'Password del usuario',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    name: 'phone',
    type: String,
    required: true,
    description: 'Telefono del usuario',
  })
  @IsOptional()
  @IsNumberString()
  phone?: string;

  @ApiProperty({
    name: 'organization',
    type: OrganizationDto,
    required: false,
    description: 'Organizacion del usuario',
  })
  @Type(() => OrganizationDto)
  @IsObject()
  organization: OrganizationDto;
}
