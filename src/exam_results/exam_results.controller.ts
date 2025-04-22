import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExamResultsService } from './exam_results.service';
import { CreateExamResultDto } from './dto/create-exam_result.dto';
import { UpdateExamResultDto } from './dto/update-exam_result.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ExamResult } from './entities/exam_result.entity';

@ApiTags('Exam Results')
@ApiBearerAuth()
@Controller('exam-results')
export class ExamResultsController {
  constructor(private readonly examResultsService: ExamResultsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new exam result',
    description: 'Creates a new exam result for the authenticated user',
  })
  @ApiBody({
    type: CreateExamResultDto,
    description: 'Data required to create an exam result',
  })
  @ApiCreatedResponse({
    description: 'The exam result has been successfully created',
    type: ExamResult,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - User is not logged in',
  })
  @ApiBadRequestResponse({ description: 'Bad request - Invalid data provided' })
  create(
    @Body() createExamResultDto: CreateExamResultDto,
    @GetUser('sub') userId: number,
  ) {
    return this.examResultsService.create(userId, createExamResultDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all exam results',
    description: 'Returns a list of all exam results',
  })
  @ApiOkResponse({
    description: 'List of exam results retrieved successfully',
    type: [ExamResult],
  })
  findAll() {
    return this.examResultsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an exam result by ID',
    description: 'Returns a single exam result by its ID',
  })
  @ApiParam({ name: 'id', description: 'Exam result ID', type: 'number' })
  @ApiOkResponse({
    description: 'Exam result retrieved successfully',
    type: ExamResult,
  })
  @ApiNotFoundResponse({ description: 'Exam result not found' })
  findOne(@Param('id') id: string) {
    return this.examResultsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an exam result',
    description: 'Updates an existing exam result by ID',
  })
  @ApiParam({ name: 'id', description: 'Exam result ID', type: 'number' })
  @ApiBody({
    type: UpdateExamResultDto,
    description: 'Data required to update an exam result',
  })
  @ApiOkResponse({
    description: 'Exam result updated successfully',
    type: ExamResult,
  })
  @ApiNotFoundResponse({ description: 'Exam result not found' })
  @ApiBadRequestResponse({ description: 'Bad request - Invalid data provided' })
  update(
    @Param('id') id: string,
    @Body() updateExamResultDto: UpdateExamResultDto,
  ) {
    return this.examResultsService.update(+id, updateExamResultDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an exam result',
    description: 'Deletes an exam result by ID',
  })
  @ApiParam({ name: 'id', description: 'Exam result ID', type: 'number' })
  @ApiOkResponse({ description: 'Exam result deleted successfully' })
  @ApiNotFoundResponse({ description: 'Exam result not found' })
  remove(@Param('id') id: string) {
    return this.examResultsService.remove(+id);
  }
}
