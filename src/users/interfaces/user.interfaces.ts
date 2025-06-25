import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  mobile_number: string;
  date_of_birth: Date;
}
