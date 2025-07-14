import { Document } from 'mongoose';
export interface Notification extends Document {
  user_id: string;
  title: string;
  message: string;
  read: boolean;
}
