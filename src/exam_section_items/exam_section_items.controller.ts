import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamSectionItemsService } from './exam_section_items.service';
import { CreateExamSectionItemDto } from './dto/create-exam_section_item.dto';
import { UpdateExamSectionItemDto } from './dto/update-exam_section_item.dto';

@Controller('exam-section-items')
export class ExamSectionItemsController {
  constructor(private readonly examSectionItemsService: ExamSectionItemsService) {}

  @Post()
  create(@Body() createExamSectionItemDto: CreateExamSectionItemDto) {
    return this.examSectionItemsService.create(createExamSectionItemDto);
  }

  @Get()
  findAll() {
    return this.examSectionItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examSectionItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamSectionItemDto: UpdateExamSectionItemDto) {
    return this.examSectionItemsService.update(+id, updateExamSectionItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examSectionItemsService.remove(+id);
  }
}
