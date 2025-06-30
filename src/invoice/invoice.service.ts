import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './interfaces/invoice.interfaces';
import { InvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoiceService {
    constructor(@InjectModel("Invoice") private invoiceModel:Model<Invoice>){}
    // async create(data:InvoiceDto):Promise<Invoice>{
    //     if(!data){
    //         throw new UnauthorizedException("Invoice data is required.")
    //     }
    //     if(!data?.client_id){
    //         throw new UnauthorizedException("Please select a client.")
    //     }
    //     try {

    //     }   catch (e) {
    //         throw new UnauthorizedException(e.message)
    //     }     
    // }
}   
