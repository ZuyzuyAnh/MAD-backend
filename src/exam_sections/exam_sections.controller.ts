import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExamSectionsService } from './exam_sections.service';
import { CreateExamSectionDto } from './dto/create-exam_section.dto';
import { UpdateExamSectionDto } from './dto/update-exam_section.dto';
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
import { ExamSection } from './entities/exam_section.entity';

@ApiTags('Exam Sections')
@Controller('exam-sections')
export class ExamSectionsController {
  constructor(private readonly examSectionsService: ExamSectionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new exam section',
    description:
      'Creates a new section within an exam. Sections can contain multiple questions and can have different types like reading, listening, etc.',
  })
  @ApiBody({
    type: CreateExamSectionDto,
    description: 'The data required to create a new exam section',
  })
  @ApiCreatedResponse({
    description: 'The exam section has been successfully created',
    type: ExamSection,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  create(@Body() createExamSectionDto: CreateExamSectionDto) {
    return this.examSectionsService.create(createExamSectionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all exam sections',
    description: 'Retrieves a list of all exam sections across all exams',
  })
  @ApiOkResponse({
    description: 'List of exam sections retrieved successfully',
    type: [ExamSection],
  })
  findAll() {
    return this.examSectionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific exam section',
    description: 'Retrieves a single exam section by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the exam section to retrieve',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Exam section retrieved successfully',
    type: ExamSection,
  })
  @ApiNotFoundResponse({ description: 'Exam section not found' })
  findOne(@Param('id') id: string) {
    return this.examSectionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an exam section',
    description: 'Updates the details of an existing exam section',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the exam section to update',
    type: 'number',
  })
  @ApiBody({
    type: UpdateExamSectionDto,
    description: 'The data to update the exam section with',
  })
  @ApiOkResponse({
    description: 'Exam section updated successfully',
    type: ExamSection,
  })
  @ApiNotFoundResponse({ description: 'Exam section not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  update(
    @Param('id') id: string,
    @Body() updateExamSectionDto: UpdateExamSectionDto,
  ) {
    return this.examSectionsService.update(+id, updateExamSectionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an exam section',
    description: 'Removes an exam section from the system',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the exam section to delete',
    type: 'number',
  })
  @ApiOkResponse({ description: 'Exam section successfully deleted' })
  @ApiNotFoundResponse({ description: 'Exam section not found' })
  remove(@Param('id') id: string) {
    return this.examSectionsService.remove(+id);
  }
}
