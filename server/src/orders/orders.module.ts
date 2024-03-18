import { Module } from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './controller/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Tag} from '../tags/entities/tag.entity';
import {Order} from './entities/order.entity';
import {TagsService} from '../tags/service/tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Tag])],
  controllers: [OrdersController],
  providers: [OrdersService, TagsService],
})
export class OrdersModule {}
