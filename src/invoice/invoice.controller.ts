import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { Invoice } from './interfaces/invoice.interfaces';
import { PaginationDto } from 'src/globalDto/pagination.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceServices: InvoiceService) {}
  @Post('create')
  async createInvoice(@Body() dto: InvoiceDto): Promise<Invoice | null> {
    return this.invoiceServices.create(dto);
  }
  @Put('update/:id')
  async update(
    @Param('id') id: string,
    dto: UpdateInvoiceDto,
  ): Promise<Invoice | null> {
    return this.invoiceServices.update(id, dto);
  }
  @Get('get-all-invoices')
  async getAllInvoices(
    @Query() paginationDto: PaginationDto,
  ): Promise<Invoice[]> {
    return this.invoiceServices.getAll(paginationDto);
  }
  @Get('get-single-invoice/:id')
  async getInvoice(@Param('id') id: string): Promise<Invoice | null> {
    return this.invoiceServices.getOne(id);
  }
  @Delete('delete-invoice/:id')
  async deleteInvoice(@Param('id') id: string): Promise<Invoice | null> {
    return this.invoiceServices.delete(id);
  }
  @Get('send-invoice/:id')
  async emailInvoice(@Param('id') id: string): Promise<Invoice | null> {
    return this.invoiceServices.sendInvoice(id);
  }
}
