import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamSingleQuestionDto } from './dto/create-exam_single_question.dto';
import { UpdateExamSingleQuestionDto } from './dto/update-exam_single_question.dto';
import { ExamSingleQuestion } from './entities/exam_single_question.entity';

@Injectable()
export class ExamSingleQuestionsService {
  constructor(
    @InjectRepository(ExamSingleQuestion)
    private readonly examSingleQuestionRepository: Repository<ExamSingleQuestion>,
  ) {}

  async create(
    createExamSingleQuestionDto: CreateExamSingleQuestionDto,
  ): Promise<ExamSingleQuestion> {
    const examSingleQuestion = this.examSingleQuestionRepository.create(
      createExamSingleQuestionDto,
    );
    return this.examSingleQuestionRepository.save(examSingleQuestion);
  }

  async findAll(): Promise<ExamSingleQuestion[]> {
    return this.examSingleQuestionRepository.find({ relations: ['exam'] });
  }

  async findOne(id: number): Promise<ExamSingleQuestion> {
    const examSingleQuestion = await this.examSingleQuestionRepository.findOne({
      where: { id },
      relations: ['exam'],
    });
    if (!examSingleQuestion) {
      throw new NotFoundException(`ExamSingleQuestion with ID ${id} not found`);
    }
    return examSingleQuestion;
  }

  async update(
    id: number,
    updateExamSingleQuestionDto: UpdateExamSingleQuestionDto,
  ): Promise<ExamSingleQuestion> {
    const examSingleQuestion = await this.findOne(id);
    Object.assign(examSingleQuestion, updateExamSingleQuestionDto);
    return this.examSingleQuestionRepository.save(examSingleQuestion);
  }

  async remove(id: number): Promise<void> {
    const examSingleQuestion = await this.findOne(id);
    await this.examSingleQuestionRepository.remove(examSingleQuestion);
  }
}
