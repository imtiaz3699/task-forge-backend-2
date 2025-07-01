import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { Invoice } from './interfaces/invoice.interfaces';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceServices: InvoiceService) {}
  @Post('create')
  async createInvoice(@Body() dto: InvoiceDto): Promise<Invoice | null> {
    return this.invoiceServices.create(dto);
  }
  @Put('update/:id')
  async update(id: string, dto: UpdateInvoiceDto): Promise<Invoice | null> {
    return this.invoiceServices.update(id, dto);
  }
  @Get('get-all-invoices')
  async getAllInvoices(): Promise<Invoice[]> {
    return this.invoiceServices.getAll();
  }
  @Get('get-single-invoice/:id')
  async getInvoice(@Param('id') id: string): Promise<Invoice | null> {
    return this.invoiceServices.getOne(id);
  }
  @Delete("delete-invoice/:id")
  async deleteInvoice(@Param("id") id: string): Promise<Invoice | null> {
    return this.invoiceServices.delete(id);
  }
}
