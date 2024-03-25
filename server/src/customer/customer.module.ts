import { forwardRef, Global, Module } from '@nestjs/common';
import { CustomerService } from './service/customer.service';
import { CustomerController } from './controller/customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/service/user.service';
import { TagsService } from '../tags/service/tags.service';
import { UserModule } from '../user/user.module';
import { TagsModule } from '../tags/tags.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Customer, Order]),
    forwardRef(() => UserModule),
    forwardRef(() => TagsModule),
  ],

  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
