import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class UserDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsString()
  mobile_number: string;
  @IsDateString()
  date_of_birth: Date;
  @IsOptional()
  @IsBoolean()
  isVerified: Boolean;
}

export class LoginDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}
