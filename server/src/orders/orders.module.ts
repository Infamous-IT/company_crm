import { Module } from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './controller/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Tag} from '../tags/entities/tag.entity';
import {Order} from './entities/order.entity';
import {TagsService} from '../tags/service/tags.service';
import {Customer} from '../customer/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Tag, Customer])],
  controllers: [OrdersController],
  providers: [OrdersService, TagsService],
})
export class OrdersModule {}
