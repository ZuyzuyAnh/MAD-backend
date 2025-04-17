import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamSectionItemDto } from './dto/create-exam_section_item.dto';
import { UpdateExamSectionItemDto } from './dto/update-exam_section_item.dto';
import { ExamSectionItem } from './entities/exam_section_item.entity';

@Injectable()
export class ExamSectionItemsService {
  constructor(
    @InjectRepository(ExamSectionItem)
    private readonly examSectionItemRepository: Repository<ExamSectionItem>,
  ) {}

  async create(
    createExamSectionItemDto: CreateExamSectionItemDto,
  ): Promise<ExamSectionItem> {
    const examSectionItem = this.examSectionItemRepository.create(
      createExamSectionItemDto,
    );
    return this.examSectionItemRepository.save(examSectionItem);
  }

  async findAll(): Promise<ExamSectionItem[]> {
    return this.examSectionItemRepository.find({
      relations: ['examSection', 'question'],
    });
  }

  async findOne(id: number): Promise<ExamSectionItem> {
    const examSectionItem = await this.examSectionItemRepository.findOne({
      where: { id },
      relations: ['examSection', 'question'],
    });
    if (!examSectionItem) {
      throw new NotFoundException(`ExamSectionItem with ID ${id} not found`);
    }
    return examSectionItem;
  }

  async update(
    id: number,
    updateExamSectionItemDto: UpdateExamSectionItemDto,
  ): Promise<ExamSectionItem> {
    const examSectionItem = await this.findOne(id);
    Object.assign(examSectionItem, updateExamSectionItemDto);
    return this.examSectionItemRepository.save(examSectionItem);
  }

  async remove(id: number): Promise<void> {
    const examSectionItem = await this.findOne(id);
    await this.examSectionItemRepository.remove(examSectionItem);
  }
}
