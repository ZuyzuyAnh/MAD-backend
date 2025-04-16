import { Injectable } from '@nestjs/common';
import { CreateExerciseQuestionDto } from './dto/create-exercise_question.dto';
import { UpdateExerciseQuestionDto } from './dto/update-exercise_question.dto';

@Injectable()
export class ExerciseQuestionsService {
  create(createExerciseQuestionDto: CreateExerciseQuestionDto) {
    return 'This action adds a new exerciseQuestion';
  }

  findAll() {
    return `This action returns all exerciseQuestions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exerciseQuestion`;
  }

  update(id: number, updateExerciseQuestionDto: UpdateExerciseQuestionDto) {
    return `This action updates a #${id} exerciseQuestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} exerciseQuestion`;
  }
}
