import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { CustomerService } from '../service/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';
import { CreatorGuard } from '../../guard/creator.guard';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createCustomerDto: CreateCustomerDto, @Req() req) {
    return this.customerService.create(createCustomerDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, CreatorGuard)
  findAll(@Req() req) {
    return this.customerService.findAll(req.user.id);
  }

  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':type/:id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
