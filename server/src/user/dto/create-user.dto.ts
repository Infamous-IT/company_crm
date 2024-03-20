import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @MinLength(2, { message: 'First name must be more than 2 characters!'})
    firstName: string;

    @MinLength(4, { message: 'Last name must be more than 4 characters!'})
    lastName: string;

    @IsEmail()
    email: string;

    @MinLength(8, { message: 'Password must be more than 8 characters!'})
    password: string;

    @IsOptional()
    uniqueId?: string;
}

export class FacebookUserDto extends CreateUserDto {
    @IsNotEmpty()
    uniqueId: string;
}
