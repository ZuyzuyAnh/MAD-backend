import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamResultDto } from './dto/create-exam_result.dto';
import { UpdateExamResultDto } from './dto/update-exam_result.dto';
import { ExamResult } from './entities/exam_result.entity';
import { ProgressService } from 'src/progress/progress.service';

@Injectable()
export class ExamResultsService {
  constructor(
    @InjectRepository(ExamResult)
    private readonly examResultRepository: Repository<ExamResult>,
    private readonly progressService: ProgressService,
  ) {}

  async create(
    userId: number,
    createExamResultDto: CreateExamResultDto,
  ): Promise<ExamResult> {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);

    const examResult = this.examResultRepository.create({
      ...createExamResultDto,
      progressId: progress.id,
    });
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

  async countCompletedExams(progressId: number) {
    return this.examResultRepository.countBy({
      progressId: progressId,
    });
  }
}
