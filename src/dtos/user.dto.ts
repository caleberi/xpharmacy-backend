import { IsEmail, IsMobilePhone, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  passwordConfirm: string;
  @IsMobilePhone()
  phone: string;
}
