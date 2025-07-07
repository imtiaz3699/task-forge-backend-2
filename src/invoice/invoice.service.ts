import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from './interfaces/invoice.interfaces';
import { InvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { PaginationDto } from 'src/globalDto/pagination.dto';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel('Invoice') private invoiceModel: Model<Invoice>) {}
  async create(data: InvoiceDto): Promise<Invoice> {
    if (!data) {
      throw new UnauthorizedException('Invoice data is required.');
    }

    if (!data.client_id) {
      throw new UnauthorizedException('Please select a client.');
    }

    if (!data.product_id?.length) {
      throw new UnauthorizedException('Please select at least one product.');
    }

    try {
      const invoice = new this.invoiceModel({
        ...data,
        client_id: new Types.ObjectId(data.client_id),
        product_id: data.product_id.map((id) => new Types.ObjectId(id)),
      });

      await invoice.save();
      return invoice;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
  async update(id: string, data: UpdateInvoiceDto): Promise<Invoice | null> {
    return await this.invoiceModel.findByIdAndUpdate(id, data);
  }
  async getAll(paginationDto: PaginationDto): Promise<Invoice[] | any> {
    const { limit = 10, offset = 1, invoice_number } = paginationDto;
    const query: Record<string, any> = {};
    if (invoice_number) {
      query.invoice_number = { $regex: invoice_number, $options: 'i' };
    }
    try {
      const [res] = await this.invoiceModel.aggregate([
        {
          $facet: {
            data: [
              {
                $lookup: {
                  from: 'clients',
                  localField: 'client_id',
                  foreignField: '_id',
                  as: 'client_id',
                },
              },
              {
                $unwind: {
                  path: '$client_id',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: 'products',
                  let: { productIds: '$product_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: ['$_id', { $ifNull: ['$$productIds', []] }],
                        },
                      },
                    },
                  ],
                  as: 'product_id',
                },
              },
              { $match: query },
              { $skip: (Number(offset) - 1) * limit },
              { $limit: limit },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);

      const data = {
        data: res?.data,
        totalResults: res?.totalCount?.[0]?.count,
        currentPage: offset,
        limit: limit,
        totalPages: Math.ceil(res?.totalCount?.[0]?.count / limit),
      };

      return data;
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
