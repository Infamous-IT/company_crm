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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Customer } from '../entities/customer.entity';
import { Tag } from '../../tags/entities/tag.entity';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created',
    type: Customer,
  })
  @ApiBody({
    type: CreateCustomerDto,
    examples: {
      example: {
        value: {
          fullName: 'John Doe',
        },
      },
    },
  })
  create(@Body() createCustomerDto: CreateCustomerDto, @Req() req) {
    return this.customerService.create(createCustomerDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Return all customers by user Id', type: [Customer] })
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  findAll(@Req() req) {
    return this.customerService.findAll(req.user.id);
  }

  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Find customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer was found', type: Customer })
  @ApiResponse({ status: 404, description: 'Customer was not found' })
  @ApiBody({
    type: UpdateCustomerDto,
    examples: {
      example: {
        value: {
          id: 'e936f828-f9c7-4be7-b08e-ea5293b3d9e6',
        },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Update customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiBody({
    type: UpdateCustomerDto,
    description: 'Use ID at format UUID',
    examples: {
      example: {
        value: {
          fullName: 'James Harden',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':type/:id')
  @ApiOperation({ summary: 'Delete customer' })
  @ApiResponse({ status: 200, description: 'The customer was successfully deleted' })
  @ApiBody({
    type: Tag,
    examples: {
      example: {
        value: {
          id: 'e936f828-f9c7-4be7-b08e-ea5293b3d9e6',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
