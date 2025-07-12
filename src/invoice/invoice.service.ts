import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice } from './interfaces/invoice.interfaces';
import { InvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';
import { PaginationDto } from 'src/globalDto/pagination.dto';
import { Counter } from './schema/invoice.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class InvoiceService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
    @InjectModel('Invoice') private invoiceModel: Model<Invoice>,
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  async sendMailInvoice(to: string, name: string, data: any) {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to InvoiceMate!',
      template: 'user', // welcome.hbs inside mail/templates
      context: {
        data,
      },
    });
  }
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

    try {
      const session = await this.connection.startSession();
      session.startTransaction();

      const product = await this.productModel
        .find({ _id: { $in: data?.product_id } })
        .session(session);

      if (!product) throw new NotFoundException('Product not found');
      for (const item of data.products) {
        const prod = product?.find(
          (p) => p?._id?.toString() === item?.product_id?.toString(),
        );
        if (!prod)
          throw new NotFoundException(`Product not found:${item?.product_id}`);
        if (prod.quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product: ${prod?.title}`,
          );
        }
        prod.quantity -= item.quantity;
        await prod.save({ session });
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
      const invoice = new this.invoiceModel(payload);
      const saved = await invoice.save({ session });
      await session.commitTransaction();
      session.endSession();
      return saved;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  // async update(id: string, data: UpdateInvoiceDto): Promise<Invoice | null> {
  //   const session = await this.connection.startSession();
  //   session.startTransaction();

  //   try {
  //     const existingInvoice = await this.invoiceModel
  //       .findById(id)
  //       .session(session);
  //     if (!existingInvoice) {
  //       throw new NotFoundException(`Invoice not found with id ${id}`);
  //     }

  //     // Step 1: Restore previous product stock
  //     for (const item of existingInvoice.products) {
  //       const product = await this.productModel
  //         .findById(item.product_id)
  //         .session(session);
  //       if (product) {
  //         product.quantity += item.quantity; // revert previous sale
  //         await product.save({ session });
  //       }
  //     }

  //     // Step 2: Check stock & subtract for new products
  //     const productList = await this.productModel
  //       .find({
  //         _id: { $in: data.product_id },
  //       })
  //       .session(session);

  //     if (!productList.length) {
  //       throw new NotFoundException('One or more products not found.');
  //     }

  //     for (const item of data.products ?? []) {
  //       const prod = productList.find(
  //         (p) => p._id.toString() === item.product_id.toString(),
  //       );
  //       if (!prod) {
  //         throw new NotFoundException(`Product not found: ${item.product_id}`);
  //       }
  //       if (prod.quantity < item.quantity) {
  //         throw new BadRequestException(
  //           `Insufficient stock for product: ${prod.title}`,
  //         );
  //       }
  //       prod.quantity -= item.quantity;
  //       await prod.save({ session });
  //     }

  //     // Step 3: Prepare update payload
  //     const payload = {
  //       date_of_issue: data.date_of_issue,
  //       due_date: data.due_date,
  //       status: data.status,
  //       payment_method: data.payment_method,
  //       notes: data.notes,
  //       terms: data.terms,
  //       currency: data.currency,
  //       tax_included: data.tax_included,
  //       client_id: new Types.ObjectId(data.client_id),
  //       product_id: data.product_id?.map((id) => new Types.ObjectId(id)),
  //       products: data.products?.map((p) => ({
  //         product_id: new Types.ObjectId(p.product_id),
  //         quantity: Number(p.quantity),
  //         unit_price: Number(p.unit_price),
  //         total_price: Number(p.total_price),
  //       })),
  //     };

  //     // Step 4: Update invoice
  //     const updatedInvoice = await this.invoiceModel.findByIdAndUpdate(
  //       id,
  //       payload,
  //       { new: true, session },
  //     );

  //     await session.commitTransaction();
  //     session.endSession();
  //     return updatedInvoice;
  //   } catch (error) {
  //     await session.abortTransaction();
  //     session.endSession();
  //     throw error;
  //   }
  // }

  async update(id: string, data: UpdateInvoiceDto): Promise<Invoice | null> {
    const session = await this.connection.startSession();
    session.startTransaction();
    const mongoId = new Types.ObjectId(id);

    try {
      const existingInvoice = await this.invoiceModel
        .findById(mongoId)
        .session(session);
      if (!existingInvoice)
        throw new NotFoundException(`Invoice not found${existingInvoice}`);

      const oldProducts = existingInvoice?.products;

      const newProducts = data?.products ?? [];

      const oldProductMap = new Map(
        oldProducts.map((p) => [p?.product_id.toString(), p?.quantity]),
      );

      const newProductMap = new Map(
        newProducts.map((p) => [p?.product_id.toString(), p?.quantity]),
      );

      // Restore stock for removed or changed products
      for (const oldItem of oldProducts) {
        const newQty = newProductMap.get(oldItem.product_id.toString());
        if (newQty === undefined || newQty !== oldItem.quantity) {
          const prod = await this.productModel
            .findById(oldItem.product_id)
            .session(session);
          if (prod) {
            prod.quantity += oldItem.quantity;
            await prod.save({ session });
          }
        }
      }

      // Subtract stock for new or changed products
      for (const newItem of newProducts) {
        const oldQty = oldProductMap.get(newItem.product_id.toString());
        if (oldQty !== newItem.quantity) {
          const prod = await this.productModel
            .findById(newItem.product_id)
            .session(session);
          if (!prod)
            throw new NotFoundException(
              `Product not found: ${newItem.product_id}`,
            );
          if (prod.quantity < newItem.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product: ${prod.title}`,
            );
          }
          prod.quantity -= newItem.quantity;
          await prod.save({ session });
        }
      }

      const payload = {
        date_of_issue: data?.date_of_issue,
        due_date: data?.due_date,
        status: data?.status,
        payment_method: data?.payment_method,
        notes: data?.notes,
        terms: data?.terms,
        currency: data?.currency,
        tax_included: data?.tax_included,
        client_id: new Types.ObjectId(data?.client_id),
        product_id: data?.product_id?.map((id) => new Types.ObjectId(id)),
        products: data?.products?.map((p) => ({
          product_id: new Types.ObjectId(p?.product_id),
          quantity: Number(p?.quantity),
          unit_price: Number(p?.unit_price),
          total_price: Number(p?.total_price),
        })),
      };

      const updatedInvoice = await this.invoiceModel.findByIdAndUpdate(
        id,
        payload,
        { new: true, session },
      );

      await session.commitTransaction();
      session.endSession();
      return updatedInvoice;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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
      const res = await this.invoiceModel
        .findById(id)
        .populate('client_id product_id products.product_id');
      if (!res) {
        throw new UnauthorizedException('Invoice does not exists.');
      }
      return res;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  async sendInvoice(id: string): Promise<Invoice | null> {
    try {
      const res = await this.invoiceModel
        .findById(id)
        .populate('client_id products.product_id');
      if (!res) {
        throw new UnauthorizedException('Invoice does not exists');
      }
      const client = res?.client_id as any;
      const email = client?.email ?? '';
      const name = client?.name ?? '';
      await this.sendMailInvoice(email, name, res);
      return res;
    } catch (e) {
      throw new InternalServerErrorException('Internal server errr.');
    }
  }
}
