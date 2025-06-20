import * as mongoose from 'mongoose';

export const DoctorSchema = new mongoose.Schema({
  doctor_name: String,
  specialization: String,
  years_of_experience: Number,
  hospital: String,
  isSenior: Boolean,
});
