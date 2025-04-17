import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExerciseQuestionDto } from './dto/create-exercise_question.dto';
import { UpdateExerciseQuestionDto } from './dto/update-exercise_question.dto';
import { ExerciseQuestion } from './entities/exercise_question.entity';

@Injectable()
export class ExerciseQuestionsService {
  constructor(
    @InjectRepository(ExerciseQuestion)
    private readonly exerciseQuestionRepository: Repository<ExerciseQuestion>,
  ) {}

  async create(
    createExerciseQuestionDto: CreateExerciseQuestionDto,
  ): Promise<ExerciseQuestion> {
    const exerciseQuestion = this.exerciseQuestionRepository.create(
      createExerciseQuestionDto,
    );
    return this.exerciseQuestionRepository.save(exerciseQuestion);
  }

  async findAll(): Promise<ExerciseQuestion[]> {
    return this.exerciseQuestionRepository.find({
      relations: ['exercise', 'question'],
    });
  }

  async findOne(id: number): Promise<ExerciseQuestion> {
    const exerciseQuestion = await this.exerciseQuestionRepository.findOne({
      where: { id },
      relations: ['exercise', 'question'],
    });
    if (!exerciseQuestion) {
      throw new NotFoundException(`ExerciseQuestion with ID ${id} not found`);
    }
    return exerciseQuestion;
  }

  async update(
    id: number,
    updateExerciseQuestionDto: UpdateExerciseQuestionDto,
  ): Promise<ExerciseQuestion> {
    const exerciseQuestion = await this.findOne(id);
    Object.assign(exerciseQuestion, updateExerciseQuestionDto);
    return this.exerciseQuestionRepository.save(exerciseQuestion);
  }

  async remove(id: number): Promise<void> {
    const exerciseQuestion = await this.findOne(id);
    await this.exerciseQuestionRepository.remove(exerciseQuestion);
  }
}
