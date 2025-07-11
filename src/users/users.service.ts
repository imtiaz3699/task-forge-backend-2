import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './interfaces/user.interfaces';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './dto/user.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel('User') private userModel: Model<User>,
  ) {}
  async sendWelcomeEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to InvoiceMate!',
      template: 'user', // welcome.hbs inside mail/templates
      context: {
        name,
      },
    });
  }
  async signup(dto: UserDto): Promise<User | any> {
    if (!dto) {
      return {
        statusCode: 400,
        message: 'Request body is missing.',
      };
    }
    if (!dto.name) {
      return {
        statusCode: 400,
        message: 'Name is required.',
      };
    }
    if (!dto.email) {
      return {
        statusCode: 400,
        message: 'Email is required.',
      };
    }
    if (!dto.password) {
      return {
        statusCode: 400,
        message: 'Password',
      };
    }
    try {
      const isUserExists = await this.userModel.find({ email: dto?.email });

      if (isUserExists?.length) {
        return {
          statusCode: 400,
          message: 'User with this email already exists.',
        };
      }
      const user = new this.userModel(dto);

      await user.save();
      const data = {
        user: user,
      };
      await this.sendWelcomeEmail(user?.email, user?.name);
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async getUsers(): Promise<User[]> {
    return await this.userModel
      .find()
      .skip((1 - 1) * 50)
      .limit(50);
  }
  async findOne(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email: email });
  }
  async findById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).select('-password');
  }
  async update(id: string, data: any): Promise<any> {
    return await this.userModel.findByIdAndUpdate(id, data, { new: true });
  }
}
