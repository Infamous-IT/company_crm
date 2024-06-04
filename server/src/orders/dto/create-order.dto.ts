import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Status } from '../../utils/enums/status';
import { ApiProperty } from '@nestjs/swagger';
import { Customer } from 'src/customer/entities/customer.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  @ApiProperty({ example: 'Need to develop banking system' })
  title: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  @ApiProperty({
    example: 'Need to develop banking system on stack of technologies - Nest.ks, React.js',
  })
  description: string;

  @IsNotEmpty()
  @ApiProperty({ example: 500000 })
  // @IsCurrency({allow_decimal: true})
  price: number;

  @IsOptional()
  @MinLength(5)
  @MaxLength(35)
  @ApiProperty({ type: () => Customer })
  customer?: string;

  @IsNotEmpty()
  @ApiProperty({ example: false })
  isComplete: boolean;

  @IsOptional()
  @ApiProperty()
  uniqueName?: string;

  @ApiProperty({ example: Status.NEW })
  status: Status;

  @IsOptional()
  @ApiProperty({ example: '04.06.2024' })
  estimatedTime?: Date;

  @IsOptional()
  @ApiProperty({ type: () => [Tag] })
  tags?: Tag[];

  @IsOptional()
  @ApiProperty({ type: () => User })
  user?: User;
}
