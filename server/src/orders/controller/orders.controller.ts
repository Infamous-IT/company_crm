import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';
import { CreatorGuard } from '../../guard/creator.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';
import { Status } from '../../utils/enums/status';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created',
    type: Order,
  })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      example: {
        value: {
          title: 'Develop voice system for protected house',
          description: 'Need to develop hard system for protected house using voice',
          price: 700000,
          isComplete: false,
          status: Status.NEW,
        },
      },
    },
  })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders by user Id', type: [Order] })
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  findAll(@Req() req, @Query('page') page: number, @Query('limit') limit: number) {
    return this.ordersService.findAll(req.user.id, +page, +limit);
  }

  @Get(':type/get_by_title')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiResponse({ status: 200, description: 'Return order by title', type: [Order] })
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  getByTitle(@Query('title') title: string) {
    return this.ordersService.getByTitle(title);
  }

  @Get(':type/total_price')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiResponse({ status: 200, description: 'Return order by total price', type: [Order] })
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  getTotalPrice() {
    return this.ordersService.getTotalPrice();
  }

  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Find order by ID' })
  @ApiResponse({ status: 200, description: 'Order was found', type: Order })
  @ApiResponse({ status: 404, description: 'Order was not found' })
  @ApiBody({
    type: UpdateOrderDto,
    examples: {
      example: {
        value: {
          id: 'e936f828-f9c7-4be7-b08e-ea5293b3d9e6',
        },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({ status: 200, description: 'The order was successfully updated' })
  @ApiBody({
    type: UpdateOrderDto,
    description: 'Use ID at format UUID',
    examples: {
      example: {
        value: {
          title: 'Develop voice system for protected house',
          description: 'Need to develop hard system for protected house using voice',
          price: 700000,
          isComplete: false,
          status: Status.NEW,
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 200, description: 'The order was successfully deleted' })
  @ApiBody({
    type: Order,
    examples: {
      example: {
        value: {
          id: 'e936f828-f9c7-4be7-b08e-ea5293b3d9e6',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
