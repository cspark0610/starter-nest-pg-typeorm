import { IsEmail, IsNotEmpty } from 'class-validator';

export class ReceiverDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
