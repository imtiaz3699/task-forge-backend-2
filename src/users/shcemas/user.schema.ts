import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
export const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: '',
  },
  date_of_birth: {
    type: Date,
    default: new Date(),
  },
  mobile_number: {
    type: String,
    default: '',
  },
});
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
