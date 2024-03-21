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
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {JwtAuthGuard} from '../../auth/guards/JwtAuthGuard';
import {CreatorGuard} from '../../guard/creator.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('page') page: number, @Query('limit') limit: number, @Query('isAdmin') isAdmin: boolean) {
    return this.userService.findAll(page, limit, isAdmin);
  }

  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
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
