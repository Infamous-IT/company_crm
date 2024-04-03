import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';
import { CreatorGuard } from '../../guard/creator.guard';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':type/')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const user = req.user.id;
    const customer = req.customers.id;
    const tags = req.tags.id;
    return this.ordersService.create(createOrderDto, user, customer, tags);
  }

  @Get(':type/get_by_title')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  getByTitle(@Query('title') title: string) {
    return this.ordersService.getByTitle(title);
  }

  @Get(':type/total_price')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  getTotalPrice(){
    return this.ordersService.getTotalPrice();
  }

  @Get(':type/')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  findAll(@Req() req, @Query('page') page: number, @Query('limit') limit: number)  {
    return this.ordersService.findAll(req.user.id, +page, +limit);
  }

  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
