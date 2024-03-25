import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer } from '../entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>
  ) {}

  async create(createCustomerDto: CreateCustomerDto, id: string) {
    const isExisting = await this.customerRepository.findBy({
      user: { id },
      fullName: createCustomerDto.fullName,
    });

    if (isExisting.length) {
      throw new BadRequestException('This customer already exists!');
    }

    const newCustomer = {
      fullName: createCustomerDto.fullName,
      user: { id },
    };

    return await this.customerRepository.save(newCustomer);
  }

  async findAll(id: string) {
    return await this.customerRepository.find({
      where: {
        user: { id },
      },
      relations: {
        user: true,
        orders: true,
      },
    });
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: {
        user: true,
        orders: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer with id ' + id + ' was not found!');
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: {
        user: true,
        orders: true,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer with id ' + id + ' was not found!');
    }

    return await this.customerRepository.update(id, updateCustomerDto);
  }

  async remove(id: string) {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Customer with id ' + id + ' was not found!');
    }

    return await this.customerRepository.delete(id);
  }
}
