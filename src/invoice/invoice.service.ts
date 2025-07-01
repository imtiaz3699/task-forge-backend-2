import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './interfaces/invoice.interfaces';
import { InvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel('Invoice') private invoiceModel: Model<Invoice>) {}
  async create(data: InvoiceDto): Promise<Invoice> {
    if (!data) {
      throw new UnauthorizedException('Invoice data is required.');
    }
    if (!data?.client_id) {
      throw new UnauthorizedException('Please select a client.');
    }
    if (!data?.product_id?.length) {
      throw new UnauthorizedException('Please select at least one product.');
    }
    try {
      const invoice = new this.invoiceModel(data);
      await invoice.save();
      return invoice;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
  async update(id: string, data: UpdateInvoiceDto): Promise<Invoice | null> {
    return await this.invoiceModel.findByIdAndUpdate(id, data);
  }
  async getAll(): Promise<Invoice[]> {
    try {
      const res = await this.invoiceModel.find().populate('client_id product_id');
      return res;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException(e.message);
    }
  }
  async delete(id: string): Promise<Invoice | null> {
    try {
      const res = await this.invoiceModel.findByIdAndDelete(id);
      if (!res) {
        throw new UnauthorizedException('Invoice does not exists');
      }
      return res;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
  async getOne(id: string): Promise<Invoice | null> {
    try {
      const res = await this.invoiceModel.findById(id);
      if (!res) {
        throw new UnauthorizedException('Invoice does not exists.');
      }
      return res;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
