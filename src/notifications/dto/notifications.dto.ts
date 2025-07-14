import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @IsString()
  user_id: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsString()
  message: string;
  @IsBoolean()
  read: boolean;
}
