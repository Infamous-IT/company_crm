import {IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import {User} from '../../user/entities/user.entity';
import {Order} from '../../orders/entities/order.entity';

export class CreateTagDto {
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    title: string;

    @IsOptional()
    user?: User;

    @IsOptional()
    order?: Order;
}
