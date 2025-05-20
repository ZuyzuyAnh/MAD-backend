// src/user_session/user_session.controller.ts
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
import { UserSessionService } from './user_session.service';
import { CreateUserSessionDto } from './dto/create-user_session.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import AppResponse from 'src/common/dto/api-response.dto';

@ApiTags('Phiên học tập')
@Controller('user-session')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo phiên học tập mới' })
  async create(@GetUser('sub') userId: number) {
    const result = await this.userSessionService.create({
      userId,
      loginTime: new Date(),
    });

    return AppResponse.successWithData({
      data: result,
      message: 'Tạo phiên thành công',
    });
  }

  @Patch(':id/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thời gian đăng xuất' })
  async updateLogoutTime(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userSessionService.updateLogoutTime(id);

    return AppResponse.successWithData({
      data: result,
      message: 'Cập nhật thời gian đăng xuất thành công',
    });
  }

  @Get('statistics/daily')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thống kê học tập theo 7 ngày gần nhất' })
  async getStudyTimeByDays(@GetUser('sub') userId: number) {
    const result =
      await this.userSessionService.getStudyTimeByLastSevenDays(userId);

    return AppResponse.successWithData({
      data: result,
    });
  }

  @Get('statistics/weekly')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thống kê học tập theo 4 tuần gần nhất' })
  async getStudyTimeByWeeks(@GetUser('sub') userId: number) {
    const result =
      await this.userSessionService.getStudyTimeByLastFourWeeks(userId);

    return AppResponse.successWithData({
      data: result,
    });
  }

  @Get('statistics/monthly')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thống kê học tập theo 4 tháng gần nhất' })
  async getStudyTimeByMonths(@GetUser('sub') userId: number) {
    const result =
      await this.userSessionService.getStudyTimeByLastFourMonths(userId);

    return AppResponse.successWithData({
      data: result,
    });
  }

  @Get('login-streak')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin chuỗi đăng nhập liên tiếp' })
  async getLoginStreak(@GetUser('sub') userId: number) {
    const result = await this.userSessionService.getLoginStreak(userId);

    return AppResponse.successWithData({
      data: result,
    });
  }

  @Get('overview')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy tổng quan học tập của người dùng' })
  async getOverview(@GetUser('sub') userId: number) {
    const dailyData =
      await this.userSessionService.getStudyTimeByLastSevenDays(userId);
    const weeklyData =
      await this.userSessionService.getStudyTimeByLastFourWeeks(userId);
    const monthlyData =
      await this.userSessionService.getStudyTimeByLastFourMonths(userId);
    const streak = await this.userSessionService.getLoginStreak(userId);
    const totalStudyTime =
      await this.userSessionService.getTotalStudyTime(userId);
    return AppResponse.successWithData({
      data: {
        streak: streak,
        dailyData,
        weeklyData,
        monthlyData,
        totalStudyTime,
      },
    });
  }
}
