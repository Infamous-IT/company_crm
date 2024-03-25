import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Tag } from '../entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) {}

  async create(createTagDto: CreateTagDto, id: string) {
    const isExisting = await this.tagRepository.findBy({
      user: { id },
      title: createTagDto.title,
    });

    if (isExisting.length) {
      throw new BadRequestException('This tag already exists!');
    }

    const newTag = {
      title: createTagDto.title,
      user: { id },
    };

    return await this.tagRepository.save(newTag);
  }

  async findAll(id: string) {
    return await this.tagRepository.find({
      where: {
        user: { id },
      },
      relations: {
        user: true,
        order: true,
      },
    });
  }

  async findOne(id: string) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: {
        user: true,
        order: true,
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag with id ' + id + ' was not found!');
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: {
        user: true,
        order: true,
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag with id ' + id + ' was not found!');
    }

    return await this.tagRepository.update(id, updateTagDto);
  }

  async remove(id: string) {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException('Tag with id ' + id + ' was not found!');
    }
    return await this.tagRepository.delete(id);
  }
}
