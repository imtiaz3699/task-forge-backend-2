import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsModule } from './items/items.module';
import { DoctorController } from './doctor/doctor.controller';
import { DoctorService } from './doctor/doctor.service';
import keys from './config/keys';
import { DoctorModule } from './doctor/doctor.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://imtiazali78652:MdfObcZvaUvKogq1@cluster0.ztdnf5k.mongodb.net/',
    ),
    ItemsModule,
    DoctorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
