import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Roles } from '../../utils/enums/roles';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'James' })
  @MinLength(2, { message: 'First name must be more than 2 characters!' })
  firstName: string;

  @ApiProperty({ example: 'Harden' })
  @MinLength(4, { message: 'Last name must be more than 4 characters!' })
  lastName: string;

  @IsEmail()
  @ApiProperty({ example: 'james.harden@gmail.com' })
  email: string;

  @MinLength(8, { message: 'Password must be more than 8 characters!' })
  @ApiProperty({ example: '11111111' })
  password: string;

  @IsOptional()
  uniqueId?: string;

  photoUrl?: string;

  @IsNotEmpty()
  @ApiProperty({ example: Roles.USER })
  role: Roles;

  @ApiProperty({ example: 500 })
  income: number;

  @ApiProperty({ example: 200 })
  costs: number;
}

export class FacebookUserDto extends CreateUserDto {
  @IsNotEmpty()
  uniqueId: string;
}
