import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExerciseQuestionsService } from './exercise_questions.service';
import { CreateExerciseQuestionDto } from './dto/create-exercise_question.dto';
import { UpdateExerciseQuestionDto } from './dto/update-exercise_question.dto';

@Controller('exercise-questions')
export class ExerciseQuestionsController {
  constructor(private readonly exerciseQuestionsService: ExerciseQuestionsService) {}

  @Post()
  create(@Body() createExerciseQuestionDto: CreateExerciseQuestionDto) {
    return this.exerciseQuestionsService.create(createExerciseQuestionDto);
  }

  @Get()
  findAll() {
    return this.exerciseQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseQuestionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExerciseQuestionDto: UpdateExerciseQuestionDto) {
    return this.exerciseQuestionsService.update(+id, updateExerciseQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseQuestionsService.remove(+id);
  }
}
