import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const user = req.user.id;
    const customer = req.customers.id;
    const tags = req.tags.id;
    return this.ordersService.create(createOrderDto, user, customer, tags);
  }

  @Get('get_by_title')
  @UseGuards(JwtAuthGuard)
  getByTitle(@Query('title') title: string) {
    return this.ordersService.getByTitle(title);
  }

  @Get('total_price')
  @UseGuards(JwtAuthGuard)
  getTotalPrice(){
    return this.ordersService.getTotalPrice();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req, @Query('page') page: number, @Query('limit') limit: number)  {
    return this.ordersService.findAll(req.user.id, +page, +limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
