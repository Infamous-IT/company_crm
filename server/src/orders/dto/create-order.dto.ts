import {Tag} from '../../tags/entities/tag.entity';
import {User} from '../../user/entities/user.entity';
import {IsCurrency, IsNotEmpty, IsNumber, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(50)
    title: string;

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(5000)
    description: string;

    @IsNotEmpty()
    @IsCurrency({allow_decimal: true})
    price: number;

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(35)
    customer: string;

    @IsNotEmpty()
    isComplete: boolean;

    @IsOptional()
    estimatedTime?: Date;

    @IsNotEmpty()
    tags: Tag;

    @IsOptional()
    user?: User;
}
