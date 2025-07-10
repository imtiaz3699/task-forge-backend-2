import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from './interfaces/invoice.interfaces';
import { InvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { PaginationDto } from 'src/globalDto/pagination.dto';
import { Counter } from './schema/invoice.schema';
@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice') private invoiceModel: Model<Invoice>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
  ) {}
  async getNextInvoiceNumber(): Promise<string> {
    try {
      const counter = await this.counterModel.findOneAndUpdate(
        { name: 'invoice' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }, // ✅ Corrected option
      );

      if (!counter) {
        throw new InternalServerErrorException(
          'Failed to create or update counter',
        );
      }

      const paddedNumber = String(counter.seq).padStart(4, '0');
      return `INV_${paddedNumber}`;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(data: InvoiceDto): Promise<Invoice | any> {
    if (!data) {
      throw new BadRequestException('Invoice data is required.');
    }

    if (!data.client_id) {
      throw new BadRequestException('Please select a client.');
    }

    if (!data.product_id?.length) {
      throw new BadRequestException('Please select at least one product.');
    }
    if (!data?.products?.length) {
      throw new BadRequestException('Please select at least one product.');
    }
    const invoice_number = await this.getNextInvoiceNumber();
    const payload = {
      date_of_issue: data?.date_of_issue,
      due_date: data?.due_date,
      invoice_number: invoice_number,
      status: data?.status,
      payment_method: data?.payment_method,
      notes: data?.notes,
      terms: data?.terms,
      currency: data?.currency,
      tax_included: data?.tax_included,
      client_id: new Types.ObjectId(data?.client_id),
      product_id: data?.product_id?.map((id) => new Types.ObjectId(id)),
      products: data?.products.map((p: any) => ({
        product_id: new Types.ObjectId(String(p.product_id)),
        quantity: Number(p.quantity),
        unit_price: Number(p.unit_price),
        total_price: Number(p.total_price),
      })),
    };
    try {
      const invoice = new this.invoiceModel(payload);
      const saved = await invoice.save();
      return saved;
      // ✅ Optionally re-fetch with population
      // return this.invoiceModel.findById(saved._id)
      // .populate('client_id')
      // .populate('products.product_id') // only if you need full product info
      // .exec();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
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
