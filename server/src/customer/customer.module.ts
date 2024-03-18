import {Global, Module } from '@nestjs/common';
import { CustomerService } from './service/customer.service';
import { CustomerController } from './controller/customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Customer} from './entities/customer.entity';
import {Order} from '../orders/entities/order.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Customer, Order])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
