import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './service/orders.service';
import { OrdersController } from './controller/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Tag} from '../tags/entities/tag.entity';
import {Order} from './entities/order.entity';
import {TagsService} from '../tags/service/tags.service';
import {Customer} from '../customer/entities/customer.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Tag, Customer, User]),
    forwardRef(() => UserModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, TagsService],
  exports: [OrdersService]
})
export class OrdersModule {}
