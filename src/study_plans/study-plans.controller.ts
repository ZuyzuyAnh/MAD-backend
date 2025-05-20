import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { CreateStudyPlanDto } from './dto/create-study-plan.dto';
import { UpdateStudyPlanDto } from './dto/update-study-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import AppResponse from '../common/dto/api-response.dto';

@ApiTags('Kế hoạch học tập')
@Controller('study-plans')
export class StudyPlansController {
  constructor(private readonly studyPlansService: StudyPlansService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo kế hoạch học tập mới' })
  @ApiBody({ type: CreateStudyPlanDto })
  @ApiResponse({
    status: 201,
    description: 'Kế hoạch học tập đã được tạo thành công',
  })
  async create(
    @Body() createStudyPlanDto: CreateStudyPlanDto,
    @GetUser('sub') userId: number,
  ) {
    const studyPlan = await this.studyPlansService.create(
      userId,
      createStudyPlanDto,
    );

    return AppResponse.successWithData({
      data: studyPlan,
      message: 'Tạo kế hoạch học tập thành công',
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy kế hoạch học tập của người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Kế hoạch học tập của người dùng',
  })
  async findMyStudyPlan(@GetUser('sub') userId: number) {
    try {
      const studyPlan = await this.studyPlansService.findByUserId(userId);

      return AppResponse.successWithData({
        data: studyPlan,
      });
    } catch (error) {
      return AppResponse.successWithData({
        data: null,
        message: 'Bạn chưa thiết lập kế hoạch học tập',
      });
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật kế hoạch học tập' })
  @ApiParam({ name: 'id', description: 'ID của kế hoạch học tập' })
  @ApiBody({ type: UpdateStudyPlanDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật kế hoạch học tập thành công',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudyPlanDto: UpdateStudyPlanDto,
  ) {
    const updatedStudyPlan = await this.studyPlansService.update(
      id,
      updateStudyPlanDto,
    );

    return AppResponse.successWithData({
      data: updatedStudyPlan,
      message: 'Cập nhật kế hoạch học tập thành công',
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa kế hoạch học tập' })
  @ApiParam({ name: 'id', description: 'ID của kế hoạch học tập' })
  @ApiResponse({
    status: 200,
    description: 'Xóa kế hoạch học tập thành công',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.studyPlansService.remove(id);

    return AppResponse.successWithData({
      data: null,
      message: 'Xóa kế hoạch học tập thành công',
    });
  }
}
