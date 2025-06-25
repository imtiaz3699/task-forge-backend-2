import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class UserDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  mobile_number:string;
  date_of_birth:Date; 
}

export class LoginDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}
