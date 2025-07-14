import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './schema/client.schema';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRequest } from 'http';
import { ClientGateway } from './client.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  controllers: [ClientController],
  providers: [ClientService,ClientGateway],
  exports: [ClientService],
})
export class ClientModule {}
