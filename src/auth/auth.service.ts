import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/interfaces/user.interfaces';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('No user found.');
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
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
}
