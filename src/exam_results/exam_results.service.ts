import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamResultDto } from './dto/create-exam_result.dto';
import { UpdateExamResultDto } from './dto/update-exam_result.dto';
import { ExamResult } from './entities/exam_result.entity';

@Injectable()
export class ExamResultsService {
  constructor(
    @InjectRepository(ExamResult)
    private readonly examResultRepository: Repository<ExamResult>,
  ) {}

  async create(createExamResultDto: CreateExamResultDto): Promise<ExamResult> {
    const examResult = this.examResultRepository.create(createExamResultDto);
    return this.examResultRepository.save(examResult);
  }

  async findAll(): Promise<ExamResult[]> {
    return this.examResultRepository.find({ relations: ['exam', 'progress'] });
  }

  async findOne(id: number): Promise<ExamResult> {
    const examResult = await this.examResultRepository.findOne({
      where: { id },
      relations: ['exam', 'progress'],
    });
    if (!examResult) {
      throw new NotFoundException(`ExamResult with ID ${id} not found`);
    }
    return examResult;
  }

  async update(
    id: number,
    updateExamResultDto: UpdateExamResultDto,
  ): Promise<ExamResult> {
    const examResult = await this.findOne(id);
    Object.assign(examResult, updateExamResultDto);
    return this.examResultRepository.save(examResult);
  }

  async remove(id: number): Promise<void> {
    const examResult = await this.findOne(id);
    await this.examResultRepository.remove(examResult);
  }
}
