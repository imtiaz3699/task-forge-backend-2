import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class ClientDto {
  @IsString()
  full_name: string;
  @IsString()
  email: string;
  @IsString()
  phone_number: string;
  @IsString()
  company_name: string;
  @IsString()
  address: string;
  @IsString()
  city: string;
  @IsString()
  country: string;
  @IsString()
  postal_code: string;
  @IsString()
  website: string;
  @IsString()
  notes: string;
}

export class UpdateClientDto extends PartialType(ClientDto) {}
