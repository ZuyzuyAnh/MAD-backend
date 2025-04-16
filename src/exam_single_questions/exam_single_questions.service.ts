import { Injectable } from '@nestjs/common';
import { CreateExamSingleQuestionDto } from './dto/create-exam_single_question.dto';
import { UpdateExamSingleQuestionDto } from './dto/update-exam_single_question.dto';

@Injectable()
export class ExamSingleQuestionsService {
  create(createExamSingleQuestionDto: CreateExamSingleQuestionDto) {
    return 'This action adds a new examSingleQuestion';
  }

  findAll() {
    return `This action returns all examSingleQuestions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examSingleQuestion`;
  }

  update(id: number, updateExamSingleQuestionDto: UpdateExamSingleQuestionDto) {
    return `This action updates a #${id} examSingleQuestion`;
  }

  remove(id: number) {
    return `This action removes a #${id} examSingleQuestion`;
  }
}
