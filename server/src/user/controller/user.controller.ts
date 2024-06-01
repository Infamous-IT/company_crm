import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';
import { CreatorGuard } from '../../guard/creator.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { Request } from 'express';
import { GoogleStorageService } from '../service/google-storage.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Roles } from '../../utils/enums/roles';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly googleStorageService: GoogleStorageService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: [User] })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 20 },
        sortField: { type: 'string', example: 'createdAt' },
        sortOrder: { type: 'string', example: 'DESC' },
        filterField: { type: 'string', example: 'firstName' },
        filterValue: { type: 'string', example: 'John' },
      },
    },
  })
  async findAll(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sortField') sortField: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('filterField') filterField?: string,
    @Query('filterValue') filterValue?: string | number
  ) {
    return this.userService.findAll(page, limit, sortField, sortOrder, filterField, filterValue);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created', type: User })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example: {
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          password: '11111111',
          role: Roles.USER,
          income: 100,
          costs: 50,
        },
      },
    },
  })
  async create(@Body() createUserDto: CreateUserDto, @UploadedFile() photoFile: Multer.File) {
    const photoUrl = await this.googleStorageService.uploadPhoto(photoFile);
    return this.userService.create(createUserDto, photoUrl);
  }

  @Patch(':type/:id/uploadPhoto')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photoUrl'))
  @ApiOperation({ summary: 'Upload photo for user' })
  @ApiResponse({ status: 200, description: 'Photo uploaded successfully', type: String })
  async uploadedPhoto(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() photoFile: Multer.File
  ) {
    const photoUrl = await this.googleStorageService.uploadPhoto(photoFile);
    return { photoUrl };
  }

  @Get(':type/:id')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiResponse({ status: 200, description: 'User was found', type: User })
  @ApiResponse({ status: 404, description: 'User was not found' })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      example: {
        value: {
          id: 'e936f828-f9c7-4be7-b08e-ea5293b3d9e6',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, CreatorGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Return current user', type: User })
  getCurrentUser(@Req() req) {
    return this.userService.getCurrentUser(req);
  }

  @Patch(':type/:id/settings')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Create SSO password for user' })
  @ApiResponse({ status: 200, description: 'SSO password created successfully' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Method for changed password',
    examples: {
      example: {
        value: {
          password: 'newPassword',
        },
      },
    },
  })
  createSSOPassword(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.createSSOPassword(id, updateUserDto);
  }

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Use ID at format UUID',
    examples: {
      example: {
        value: {
          firstName: 'James',
          lastName: 'Harden',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiBody({
    type: User,
    examples: {
      example: {
        value: {
          id: 'e936f828-f9c7-4be7-b08e-ea5293b3d9e6',
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
