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

@Controller('exam-results')
export class ExamResultsController {
  constructor(private readonly examResultsService: ExamResultsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createExamResultDto: CreateExamResultDto,
    @GetUser('sub') userId: number,
  ) {
    return this.examResultsService.create(userId, createExamResultDto);
  }

  @Get()
  findAll() {
    return this.examResultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examResultsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExamResultDto: UpdateExamResultDto,
  ) {
    return this.examResultsService.update(+id, updateExamResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examResultsService.remove(+id);
  }
}
