import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ReceiverDto {
  @ApiProperty({
    name: 'Receiver Email',
    type: String,
    required: true,
    description: 'Direccion de email de un destinatario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
