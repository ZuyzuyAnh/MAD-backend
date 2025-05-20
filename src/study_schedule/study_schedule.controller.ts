import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { StudyScheduleService } from './study_schedule.service';
import { CreateStudyScheduleDto } from './dto/create-study_schedule.dto';
import { UpdateStudyScheduleDto } from './dto/update-study_schedule.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import AppResponse from 'src/common/dto/api-response.dto';

@Controller('study-schedule')
export class StudyScheduleController {
  constructor(private readonly studyScheduleService: StudyScheduleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createStudyScheduleDto: CreateStudyScheduleDto,
    @GetUser('sub') userId: number,
  ) {
    await this.studyScheduleService.create(userId, createStudyScheduleDto);

    return AppResponse.success('Tạo lịch học thành công');
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studyScheduleService.findOne(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findByUser(@GetUser('sub') userId: number) {
    const data = await this.studyScheduleService.findByUser(userId);

    return AppResponse.successWithData({
      data,
      message: 'Lấy lịch học thành công',
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudyScheduleDto: UpdateStudyScheduleDto,
  ) {
    await this.studyScheduleService.update(id, updateStudyScheduleDto);

    return AppResponse.success('Cập nhật lịch học thành công');
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studyScheduleService.remove(id);
  }
}
