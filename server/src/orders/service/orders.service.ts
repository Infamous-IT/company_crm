import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
  }

  async create(createOrderDto: CreateOrderDto, userId: string, customerId: string, tagId: string) {
    const newOrder: DeepPartial<Order> = {
      title: createOrderDto.title,
      description: createOrderDto.description,
      price: createOrderDto.price,
      isComplete: createOrderDto.isComplete,
      estimatedTime: createOrderDto.estimatedTime,
      user: { id: userId },
      customer: { id: customerId },
      tags: [{ id: tagId }],
    };

    try {
      return await this.orderRepository.save(newOrder);
    } catch (error) {
      throw new BadRequestException('Something went wrong by creating a new order!');
    }
  }

  /**
   TODO: Need fix this method
   */
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} was not found!`);
    }

    const partialOrder: DeepPartial<Order> = {
      ...updateOrderDto,
      customer: updateOrderDto.customer ? { id: updateOrderDto.customer } : undefined,
    };

    try {
      await this.orderRepository.update(id, partialOrder);
      return { ...order, ...partialOrder };
    } catch (error) {
      throw new BadRequestException('Something went wrong by updating an order!');
    }
  }

  async findAll(id: string, page: number, limit: number) {
    const order = await this.orderRepository.find({
      where: {
        user: { id },
      },
      relations: {
        user: true,
        customer: true,
        tags: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return order;
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        tags: true,
        user: true,
        customer: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order with id ' + id + ' was not found!');
    }

    return order;
  }

  async remove(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order with id ' + id + ' was not found!');
    }

    return await this.orderRepository.delete(order);
  }

  async getTotalPrice() {
    const totalPrice = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.price)', 'totalPrice')
      .getRawOne();

    return totalPrice.price | 0;
  }

  async sortOrdersByField(field: string) {
    const validFields = ['title', 'description', 'price'];

    if (!validFields.includes(field)) {
      throw new BadRequestException(`Invalid field for sorting: ${field}`);
    }

    return await this.orderRepository.find({
      order: { [field]: 'ASC' },
    });
  }

  async getByTitle(title: string) {
    return await this.orderRepository.find({
      where: { title },
    });
  };
}
