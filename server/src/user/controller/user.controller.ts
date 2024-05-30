import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  UnauthorizedException,
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
import { Roles } from '../../utils/enums/roles';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly googleStorageService: GoogleStorageService
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto, @UploadedFile() photoFile: Multer.File) {
    const photoUrl = await this.googleStorageService.uploadPhoto(photoFile);
    return this.userService.create(createUserDto, photoUrl);
  }

  @Patch(':type/:id/uploadPhoto')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photoUrl'))
  async uploadedPhoto(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() photoFile: Multer.File
  ) {
    const photoUrl = await this.googleStorageService.uploadPhoto(photoFile);
    return { photoUrl };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sortField') sortField: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('filterField') filterField?: string,
    @Query('filterValue') filterValue?: string | number
  ) {
    const userRole = req.user['role'];
    const isAdmin = userRole === Roles.ADMIN;

    if (!isAdmin) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }
    return this.userService.findAll(
      page,
      limit,
      isAdmin,
      sortField,
      sortOrder,
      filterField,
      filterValue
    );
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll(
  //   @Query('page') page: number,
  //   @Query('limit') limit: number,
  //   @Query('isAdmin') isAdmin: boolean
  // ) {
  //   return this.userService.findAll(page, limit, isAdmin);
  // }
  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Req() req) {
    return this.userService.getCurrentUser(req);
  }

  @Patch(':type/:id/settings')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  createSSOPassword(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.createSSOPassword(id, updateUserDto);
  }

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
