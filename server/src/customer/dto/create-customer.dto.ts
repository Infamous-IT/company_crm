import { User } from '../../user/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { IsOptional, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @MinLength(5, { message: 'Full name must be more than 5 characters!' })
  fullName: string;

  @IsOptional()
  user?: User;

  @IsOptional()
  orders?: Order[];
}
