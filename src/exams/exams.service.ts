import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const exam = this.examRepository.create(createExamDto);
    return this.examRepository.save(exam);
  }

  async findAll(): Promise<Exam[]> {
    return this.examRepository.find({ relations: ['language'] });
  }

  async findOne(id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['language'],
    });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);
    Object.assign(exam, updateExamDto);
    return this.examRepository.save(exam);
  }

  async remove(id: number): Promise<void> {
    const exam = await this.findOne(id);
    await this.examRepository.remove(exam);
  }
}
