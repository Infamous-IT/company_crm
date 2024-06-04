import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TagsService } from '../service/tags.service';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { JwtAuthGuard } from '../../auth/guards/JwtAuthGuard';
import { CreatorGuard } from '../../guard/creator.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Tag } from '../entities/tag.entity';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created',
    type: Tag,
  })
  @ApiBody({
    type: CreateTagDto,
    examples: {
      example: {
        value: {
          title: 'Web development',
        },
      },
    },
  })
  create(@Body() createTagDto: CreateTagDto, @Req() req) {
    return this.tagsService.create(createTagDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'Return all tags by user Id', type: [Tag] })
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  findAll(@Req() req) {
    return this.tagsService.findAll(req.user.id);
  }

  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Find tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag was found', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag was not found' })
  @ApiBody({
    type: UpdateTagDto,
    examples: {
      example: {
        value: {
          id: 'e936f828-f9c7-4be7-b08e-ea5293b3d9e6',
        },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Update tag' })
  @ApiResponse({ status: 200, description: 'The tag was updated successfully' })
  @ApiBody({
    type: UpdateTagDto,
    description: 'Use ID at format UUID',
    examples: {
      example: {
        value: {
          title: 'Facebook Ads',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, CreatorGuard)
  @ApiOperation({ summary: 'Delete tag' })
  @ApiResponse({ status: 200, description: 'The tag deleted successfully' })
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
    return this.tagsService.remove(id);
  }
}
