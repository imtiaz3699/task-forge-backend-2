import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { User } from './interfaces/user.interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}
  @Post()
  async createUser(@Body() dto: UserDto): Promise<User | any> {
    return this.userServices.signup(dto);
  }
  @Get()
  async getUsers(): Promise<User[]> {
    return this.userServices.getUsers();
  }
}
