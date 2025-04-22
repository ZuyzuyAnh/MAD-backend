import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExamSectionItemsService } from './exam_section_items.service';
import { CreateExamSectionItemDto } from './dto/create-exam_section_item.dto';
import { UpdateExamSectionItemDto } from './dto/update-exam_section_item.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ExamSectionItem } from './entities/exam_section_item.entity';

@ApiTags('Exam Section Items')
@Controller('exam-section-items')
export class ExamSectionItemsController {
  constructor(
    private readonly examSectionItemsService: ExamSectionItemsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new exam section item',
    description:
      'Creates a new item within an exam section containing a question',
  })
  @ApiBody({
    type: CreateExamSectionItemDto,
    description: 'Data required to create an exam section item',
  })
  @ApiCreatedResponse({
    description: 'The exam section item has been successfully created',
    type: ExamSectionItem,
  })
  @ApiBadRequestResponse({ description: 'Bad request - Invalid data provided' })
  create(@Body() createExamSectionItemDto: CreateExamSectionItemDto) {
    return this.examSectionItemsService.create(createExamSectionItemDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all exam section items',
    description: 'Returns a list of all exam section items',
  })
  @ApiOkResponse({
    description: 'List of exam section items retrieved successfully',
    type: [ExamSectionItem],
  })
  findAll() {
    return this.examSectionItemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an exam section item by ID',
    description: 'Returns a single exam section item by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Exam section item ID',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Exam section item retrieved successfully',
    type: ExamSectionItem,
  })
  @ApiNotFoundResponse({ description: 'Exam section item not found' })
  findOne(@Param('id') id: string) {
    return this.examSectionItemsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an exam section item',
    description: 'Updates an existing exam section item by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Exam section item ID',
    type: 'number',
  })
  @ApiBody({
    type: UpdateExamSectionItemDto,
    description: 'Data required to update an exam section item',
  })
  @ApiOkResponse({
    description: 'Exam section item updated successfully',
    type: ExamSectionItem,
  })
  @ApiNotFoundResponse({ description: 'Exam section item not found' })
  @ApiBadRequestResponse({ description: 'Bad request - Invalid data provided' })
  update(
    @Param('id') id: string,
    @Body() updateExamSectionItemDto: UpdateExamSectionItemDto,
  ) {
    return this.examSectionItemsService.update(+id, updateExamSectionItemDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an exam section item',
    description: 'Deletes an exam section item by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Exam section item ID',
    type: 'number',
  })
  @ApiOkResponse({ description: 'Exam section item deleted successfully' })
  @ApiNotFoundResponse({ description: 'Exam section item not found' })
  remove(@Param('id') id: string) {
    return this.examSectionItemsService.remove(+id);
  }
}
