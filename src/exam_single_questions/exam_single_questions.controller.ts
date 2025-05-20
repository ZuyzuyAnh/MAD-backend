import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExamSingleQuestionsService } from './exam_single_questions.service';
import { CreateExamSingleQuestionDto } from './dto/create-exam_single_question.dto';
import { UpdateExamSingleQuestionDto } from './dto/update-exam_single_question.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ExamSingleQuestion } from './entities/exam_single_question.entity';

@ApiTags('Exam Single Questions')
@Controller('exam-single-questions')
export class ExamSingleQuestionsController {
  constructor(
    private readonly examSingleQuestionsService: ExamSingleQuestionsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new exam single question',
    description:
      'Adds a question directly to an exam without being part of a section',
  })
  @ApiBody({
    type: CreateExamSingleQuestionDto,
    description: 'Data required to create an exam single question',
  })
  @ApiCreatedResponse({
    description: 'The exam single question has been successfully created',
    type: ExamSingleQuestion,
  })
  @ApiBadRequestResponse({ description: 'Bad request - Invalid data provided' })
  create(@Body() createExamSingleQuestionDto: CreateExamSingleQuestionDto) {
    return this.examSingleQuestionsService.create(createExamSingleQuestionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all exam single questions',
    description: 'Retrieves all questions directly associated with exams',
  })
  @ApiOkResponse({
    description: 'List of exam single questions retrieved successfully',
    type: [ExamSingleQuestion],
  })
  findAll() {
    return this.examSingleQuestionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an exam single question by ID',
    description:
      'Retrieves a specific question directly associated with an exam',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the exam single question to retrieve',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Exam single question retrieved successfully',
    type: ExamSingleQuestion,
  })
  @ApiNotFoundResponse({ description: 'Exam single question not found' })
  findOne(@Param('id') id: string) {
    return this.examSingleQuestionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an exam single question',
    description: 'Updates the properties of a specific exam single question',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the exam single question to update',
    type: 'number',
  })
  @ApiBody({
    type: UpdateExamSingleQuestionDto,
    description: 'Data required to update an exam single question',
  })
  @ApiOkResponse({
    description: 'Exam single question updated successfully',
    type: ExamSingleQuestion,
  })
  @ApiNotFoundResponse({ description: 'Exam single question not found' })
  @ApiBadRequestResponse({ description: 'Bad request - Invalid data provided' })
  update(
    @Param('id') id: string,
    @Body() updateExamSingleQuestionDto: UpdateExamSingleQuestionDto,
  ) {
    return this.examSingleQuestionsService.update(
      +id,
      updateExamSingleQuestionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an exam single question',
    description: 'Removes a question from direct association with an exam',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the exam single question to delete',
    type: 'number',
  })
  @ApiOkResponse({ description: 'Exam single question deleted successfully' })
  @ApiNotFoundResponse({ description: 'Exam single question not found' })
  remove(@Param('id') id: string) {
    return this.examSingleQuestionsService.remove(+id);
  }
}
