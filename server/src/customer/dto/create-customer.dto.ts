import { User } from '../../user/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @MinLength(5, { message: 'Full name must be more than 5 characters!' })
  @ApiProperty({example: 'Donovan Michel'})
  fullName: string;

  @IsOptional()
  @ApiProperty({type: () => (User)})
  user?: User;

  @IsOptional()
  @ApiProperty({type: () => [Order]})
  orders?: Order[];
}
