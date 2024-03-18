import { Module } from '@nestjs/common';
import { TagsService } from './service/tags.service';
import { TagsController } from './controller/tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Tag} from './entities/tag.entity';
import {Order} from '../orders/entities/order.entity';
import {OrdersService} from '../orders/service/orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Order])],
  controllers: [TagsController],
  providers: [TagsService, OrdersService],
})
export class TagsModule {}
