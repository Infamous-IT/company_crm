import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Roles } from '../../utils/enums/roles';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));
describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockReturnValue([[], 0]),
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Should create user and return user data and token', async () => {
      const createUserDto: CreateUserDto = {
        email: 'james.harder@gmail.com',
        password: 'password',
        firstName: 'James',
        lastName: 'Harden',
        income: 1000,
        costs: 500,
        role: Roles.USER,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue({ ...createUserDto, id: '1' } as User);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        user: { ...createUserDto, id: '1', password: 'password' },
        token: 'token',
      });
    });

    it('should throw BadRequestException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'First',
        lastName: 'Last',
        income: 1000,
        costs: 500,
        role: Roles.USER,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });
  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      const request = { user: { email: 'test@example.com' } };

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue({ email: 'test@example.com' } as User);

      const result = await service.getCurrentUser(request);

      expect(result).toEqual({ currentUser: { email: 'test@example.com' } });
    });
  });

  describe('createSSOPassword', () => {
    it('should update user password', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { password: 'newPassword' };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({ id } as User);

      await service.createSSOPassword(id, updateUserDto);

      expect(userRepository.update).toHaveBeenCalledWith(id, {
        ...updateUserDto,
        password: 'hashedPassword',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { password: 'newPassword' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createSSOPassword(id, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const page = 1;
      const limit = 10;
      const sortField = 'createdAt';
      const sortOrder: 'ASC' | 'DESC' = 'ASC';

      const [users, total] = [[], 0];

      jest
        .spyOn(userRepository.createQueryBuilder('user'), 'getManyAndCount')
        .mockResolvedValue([users, total]);

      const result = await service.findAll(page, limit, sortField, sortOrder);

      expect(result).toEqual({
        data: users,
        total,
        page,
        limit,
      });
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const user = { id } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOneById(id);

      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = { email } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne(email);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      const email = 'test@example.com';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { firstName: 'Updated' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({ id } as User);

      await service.update(id, updateUserDto);

      expect(userRepository.update).toHaveBeenCalledWith(id, updateUserDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { firstName: 'Updated' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(id, updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const id = '1';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({ id } as User);

      await service.remove(id);

      expect(userRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if user not found', async () => {
      const id = '1';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = { email } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOneByEmail(email);

      expect(result).toEqual(user);
    });
  });

  describe('findOneByUniqueId', () => {
    it('should return a user by uniqueId', async () => {
      const uniqueId = 'uniqueId';
      const user = { uniqueId } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOneByUniqueId(uniqueId);

      expect(result).toEqual(user);
    });
  });
});
