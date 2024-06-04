import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({ example: 'Web development' })
  title: string;

  @IsOptional()
  @ApiProperty({ type: () => User })
  user?: User;

  @IsOptional()
  @ApiProperty({ type: () => Order })
  order?: Order;
}
