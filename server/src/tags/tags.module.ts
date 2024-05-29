import { Module, forwardRef } from '@nestjs/common';
import { TagsService } from './service/tags.service';
import { TagsController } from './controller/tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Order } from '../orders/entities/order.entity';
import { OrdersService } from '../orders/service/orders.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/service/user.service';
import { UserModule } from '../user/user.module';
import {GoogleStorageService} from "../user/service/google-storage.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, Order, User]),
    forwardRef(() => UserModule),
  ],
  controllers: [TagsController],
  providers: [TagsService, OrdersService, UserService, GoogleStorageService],
  exports: [TagsService]
})
export class TagsModule {
}
