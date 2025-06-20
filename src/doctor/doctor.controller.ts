import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Doctor } from './interfaces/doctor.interfaces';
import { DoctorDto } from './dto/doctor.dto';
import { DoctorService } from './doctor.service';
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorServices: DoctorService) {}
  @Get()
  async findAll(): Promise<Doctor[]> {
    return this.doctorServices.findAll();
  }
  @Get('get-single-doctor/:id')
  async findOne(@Param('id') id: string): Promise<Doctor | null> {
    return this.doctorServices.findById(id);
  }
  @Post('create')
  async create(@Body() createDoctorDto: DoctorDto): Promise<Doctor | null> {
    return this.doctorServices.createDoctor(createDoctorDto);
  }
  @Put('update/:id')
  async update(
    @Body() updateDoctorDto: DoctorDto,
    @Param('id') id,
  ): Promise<Doctor | null> {
    return this.doctorServices.updateDoctor(id, updateDoctorDto);
  }
  @Delete('delete/:id')
  async delete(@Param('id') id): Promise<Doctor | null> {
    return this.doctorServices.deleteDoctor(id);
  }
}
