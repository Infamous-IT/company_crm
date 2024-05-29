import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto, photoUrl?: string) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) throw new BadRequestException('This email already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userRepository.save({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password: hashedPassword,
      photoUrl: createUserDto.photoUrl,
      ...(createUserDto.uniqueId && { uniqueId: createUserDto.uniqueId }),
    });

    const token = this.jwtService.sign({ email: createUserDto.email });

    return { user, token };
  }

  async getCurrentUser(request) {
    const currentUser = await this.userRepository.findOne({
      ...(request.user.email && {
        where: {
          email: request.user.email,
        },
      }),
      relations: {
        customers: true,
        orders: true,
        tags: true,
      },
    });
    return { currentUser };
  }

  async createSSOPassword(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) throw new NotFoundException(`User with id ${id} was not found`);

    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);

    return await this.userRepository.update(id, { ...updateUserDto, password: hashedPassword });
  }

  async findAll(page: number, limit: number, isAdmin: boolean) {
    if (!isAdmin) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }
    const users = await this.userRepository.find({
      relations: {
        orders: true,
        customers: true,
        tags: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return users;
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        orders: true,
        tags: true,
        customers: true,
      },
    });
    return user;
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        orders: true,
        tags: true,
        customers: true,
      },
    });

    if (!user) throw new NotFoundException(`User with email ${email} was not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        orders: true,
        tags: true,
        customers: true,
      },
    });

    if (!user) throw new NotFoundException(`User with id ${id} was not found`);

    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException(`User with id ${id} was not found`);
    return await this.userRepository.delete(id);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneByUniqueId(uniqueId: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { uniqueId } });
  }
}
