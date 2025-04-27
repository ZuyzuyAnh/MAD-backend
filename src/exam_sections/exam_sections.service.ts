import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamSectionDto } from './dto/create-exam_section.dto';
import { UpdateExamSectionDto } from './dto/update-exam_section.dto';
import { ExamSection } from './entities/exam_section.entity';
import { ExamSectionItemsService } from 'src/exam_section_items/exam_section_items.service';

@Injectable()
export class ExamSectionsService {
  constructor(
    @InjectRepository(ExamSection)
    private readonly examSectionRepository: Repository<ExamSection>,
    private readonly examSectionItemService: ExamSectionItemsService,
  ) {}

  async create(
    createExamSectionDto: CreateExamSectionDto,
  ): Promise<ExamSection> {
    const examSection = this.examSectionRepository.create(createExamSectionDto);
    return this.examSectionRepository.save(examSection);
  }

  async findAll(): Promise<ExamSection[]> {
    return this.examSectionRepository.find({ relations: ['exam'] });
  }

  async findOne(id: number): Promise<ExamSection> {
    const examSection = await this.examSectionRepository.findOne({
      where: { id },
      relations: ['exam'],
    });
    if (!examSection) {
      throw new NotFoundException(`ExamSection with ID ${id} not found`);
    }
    return examSection;
  }

  async update(
    id: number,
    updateExamSectionDto: UpdateExamSectionDto,
  ): Promise<ExamSection> {
    const examSection = await this.findOne(id);
    Object.assign(examSection, updateExamSectionDto);
    return this.examSectionRepository.save(examSection);
  }

  async remove(id: number): Promise<void> {
    const examSection = await this.findOne(id);
    await this.examSectionRepository.remove(examSection);
  }

  async countSectionItemsByExamId(examId: number): Promise<number> {
    const sections = await this.examSectionRepository.find({
      where: { examId },
    });

    const sectionItemCounts = await Promise.all(
      sections.map((section) =>
        this.examSectionItemService.countBySectionId(section.id),
      ),
    );

    return sectionItemCounts.reduce((total, count) => total + count, 0);
  }
}
