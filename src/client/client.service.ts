import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Client } from './interfaces/client.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { ClientDto, UpdateClientDto } from './dto/client.dto';
import { ifError } from 'assert';
import { ClientQueryDto, PaginationDto } from 'src/globalDto/pagination.dto';

@Injectable()
export class ClientService {
  constructor(@InjectModel('Client') private clientModel: Model<Client>) {}

  async getAll(clientQueryDto: ClientQueryDto): Promise<
    | {
        data: Client[];
        totalResults: number;
        totalPages: number;
        currentPage: number;
      }
    | any
  > {
    const { offset = 1, limit = 10, name, email } = clientQueryDto;
    const query: Record<string, any> = {};
    if (email) {
      query.email = { $regex: String(email).trim(), $options: 'i' };
    }
    if (name) {
      query.full_name = { $regex: String(name).trim(), $options: 'i' };
    }
    const [res] = await this.clientModel.aggregate([
      { $match: query },
      {
        $facet: {
          data: [{ $skip: (offset - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ]);
    return {
      data: res.data,
      totalResults: res.totalCount[0]?.count || 0,
      totalPages: Math.ceil((res.totalCount[0]?.count || 0) / limit),
      currentPage: offset,
    };
  }

  async create(@Body() dto: ClientDto): Promise<Client | any> {
    if (!dto) {
      throw new UnauthorizedException('Client data is required.');
    }
    if (!dto?.email) {
      throw new UnauthorizedException('Email is required.');
    }
    if (!dto?.full_name) {
      throw new UnauthorizedException('Full name is required.');
    }
    if (!dto?.company_name) {
      throw new UnauthorizedException('Company name is required.');
    }
    try {
      const res = await this.clientModel.find({ email: dto?.email });
      if (res?.length) {
        throw new UnauthorizedException('User with this email already exists.');
      }
      const client = new this.clientModel(dto);
      await client.save();
      return client;
    } catch (error) {
      throw new UnauthorizedException(error?.message);
    }
  }
  async update(id: string, data: UpdateClientDto): Promise<Client | null> {
    if (!data?.email) {
      throw new UnauthorizedException('Email is required.');
    }
    if (!data?.full_name) {
      throw new UnauthorizedException('Name is required.');
    }
    if (!data?.phone_number) {
      throw new UnauthorizedException('Phone number is required.');
    }
    try {
      const updatedClient = await this.clientModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedClient) {
        throw new UnauthorizedException('Client does not exists.');
      }
      return updatedClient;
    } catch (error) {
      throw new UnauthorizedException(error?.message);
    }
  }
  async getOne(id: string): Promise<Client | null> {
    try {
      const res = await this.clientModel.findById(id);
      if (!res) {
        throw new UnauthorizedException('Client does not exists.');
      }
      return res;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
  async delete(id: string): Promise<Client | null> {
    try {
      const res = await this.clientModel.findByIdAndDelete(id);
      if (!res) {
        throw new UnauthorizedException('Cliient does not exists.');
      }
      return res;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
