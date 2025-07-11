import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UserDto } from './dto/user.dto';
import { User } from './interfaces/user.interfaces';
import { Public } from 'src/config/public';

@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}
  @Public()
  @Post('register')
  async createUser(@Body() dto: UserDto): Promise<User | any> {
    return this.userServices.signup(dto);
  }
  @Put(':id')
  async updateUser(
    @Body() dto: UpdateUserDto, 
    @Param('id') id: string,
  ): Promise<any> {
    return this.userServices.update(id, dto);
  }
  @Get()
  async getUsers(): Promise<User[]> {
    return this.userServices.getUsers();
  }
  @Get(':id')
  async getSingleUser(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<User | null> {
    return this.userServices.findOne(id);
  }
}
