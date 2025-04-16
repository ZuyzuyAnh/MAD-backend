import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamSingleQuestionsService } from './exam_single_questions.service';
import { CreateExamSingleQuestionDto } from './dto/create-exam_single_question.dto';
import { UpdateExamSingleQuestionDto } from './dto/update-exam_single_question.dto';

@Controller('exam-single-questions')
export class ExamSingleQuestionsController {
  constructor(private readonly examSingleQuestionsService: ExamSingleQuestionsService) {}

  @Post()
  create(@Body() createExamSingleQuestionDto: CreateExamSingleQuestionDto) {
    return this.examSingleQuestionsService.create(createExamSingleQuestionDto);
  }

  @Get()
  findAll() {
    return this.examSingleQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examSingleQuestionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamSingleQuestionDto: UpdateExamSingleQuestionDto) {
    return this.examSingleQuestionsService.update(+id, updateExamSingleQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examSingleQuestionsService.remove(+id);
  }
}
