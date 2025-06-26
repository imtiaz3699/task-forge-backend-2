import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/interfaces/user.interfaces';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(email: string, password: string): Promise<any> {
    if (!email) {
      throw new UnauthorizedException('Email is required.');
    }
    if (!password) {
      throw new UnauthorizedException('Password is required.');
    }
    const cleanedEmail = email?.trim()?.toLowerCase();
    const user = await this.userService.findOne(cleanedEmail);
    if (!user) {
      throw new UnauthorizedException('Email or password is wrong.');
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is wrong.');
    }
    const payload = { _id: user?._id, email: user?.email, name: user?.name };
    const token = await this.jwtService.signAsync(payload);
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    const data = {
      user: userObj,
      token: token,
    };
    return data;
  }
  async getProfile(id: string): Promise<User | null> {
    return await this.userService.findById(id);
  }
}
