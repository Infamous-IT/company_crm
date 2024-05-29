import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Status } from '../../utils/enums/status';

export class CreateOrderDto {
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  description: string;

  @IsNotEmpty()
  // @IsCurrency({allow_decimal: true})
  price: number;

  @IsOptional()
  @MinLength(5)
  @MaxLength(35)
  customer?: string;

  @IsNotEmpty()
  isComplete: boolean;

  @IsOptional()
  uniqueName?: string;

  status: Status;

  @IsOptional()
  estimatedTime?: Date;

  @IsOptional()
  tags?: Tag[];

  @IsOptional()
  user?: User;
}
