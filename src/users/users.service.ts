import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interfaces';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
  async signup(dto: UserDto): Promise<User | > {
    if(!dto.name){
        return 
    }
    const user = new this.userModel(dto);
    return await user.save();
  }
}
