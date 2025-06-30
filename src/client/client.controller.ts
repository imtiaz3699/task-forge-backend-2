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
import { ClientService } from './client.service';
import { Client } from './interfaces/client.interfaces';
import { ClientDto } from './dto/client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientServices: ClientService) {}
  @Get('get-all-clients')
  async getAllClients(@Query('email') email:string): Promise<Client[]> {
    return await this.clientServices.getAll(email);
  }
  @Post('create')
  async createClient(@Body() dto: ClientDto): Promise<Client | null> {
    return this.clientServices.create(dto);
  }
  @Put('update-client/:id')
  async updateClient(
    @Param('id') id: string,
    @Body() dto: ClientDto,
  ): Promise<Client | null> {
    return this.clientServices.update(id, dto);
  }
  @Delete('delete-client/:id')
  async deleteClient(@Param('id') id: string): Promise<Client | null> {
    return this.clientServices.delete(id);
  }
  @Get('get-single-client/:id')
  async getSingleClient(@Param('id') id: string): Promise<Client | null> {
    return this.clientServices.getOne(id);
  }
}
