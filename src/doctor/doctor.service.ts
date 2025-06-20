import { Injectable } from '@nestjs/common';
import { Doctor } from './interfaces/doctor.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class DoctorService {
  constructor(
    @InjectModel('Doctor') private readonly doctorModel: Model<Doctor>,
  ) {}
  async findAll(): Promise<Doctor[]> {
    return await this.doctorModel.find();
  }
  async createDoctor(data: Doctor): Promise<Doctor | null> {
    return await this.doctorModel.create(data);
  }
  async updateDoctor(id: string, data: Doctor): Promise<Doctor | null> {
    return await this.doctorModel.findByIdAndUpdate(id, data, { new: true });
  }
  async deleteDoctor(id: string): Promise<Doctor | null> {
    return await this.doctorModel.findByIdAndDelete(id);
  }
  async findById(id: string): Promise<Doctor | null> {
    return await this.doctorModel.findById(id);
  }
}
