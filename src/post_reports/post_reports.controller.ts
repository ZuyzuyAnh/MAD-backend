import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostReportsService } from './post_reports.service';
import { CreatePostReportDto } from './dto/create-post-report.dto';
import { UpdatePostReportDto } from './dto/update-post-report.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import AppResponse from 'src/common/dto/api-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PostReport, ReportReason } from './entities/post-report.entity';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Báo cáo bài viết')
@Controller('post-reports')
export class PostReportsController {
  constructor(private readonly postReportsService: PostReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Báo cáo một bài viết' })
  async create(
    @Body() createPostReportDto: CreatePostReportDto,
    @GetUser('sub') userId: number,
  ) {
    const report = await this.postReportsService.create(
      createPostReportDto,
      userId,
    );

    return AppResponse.successWithData({
      data: report,
      message: 'Báo cáo bài viết thành công',
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách báo cáo (chỉ dành cho admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() paginateDto: PaginateDto) {
    const reports = await this.postReportsService.findAll(paginateDto);

    return AppResponse.successWithData({
      data: reports,
    });
  }

  @Get('my-reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách báo cáo của người dùng hiện tại' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMyReports(
    @GetUser('sub') userId: number,
    @Query() paginateDto: PaginateDto,
  ) {
    const reports = await this.postReportsService.findByUserId(
      userId,
      paginateDto,
    );

    return AppResponse.successWithData({
      data: reports,
    });
  }

  @Get('post/:postId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy tất cả báo cáo của một bài viết (chỉ dành cho admin)',
  })
  @ApiParam({ name: 'postId', description: 'ID của bài viết' })
  async findByPostId(@Param('postId', ParseIntPipe) postId: number) {
    const reports = await this.postReportsService.findByPostId(postId);

    return AppResponse.successWithData({
      data: reports,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết báo cáo (chỉ dành cho admin)',
  })
  @ApiParam({ name: 'id', description: 'ID của báo cáo' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const report = await this.postReportsService.findOne(id);

    return AppResponse.successWithData({
      data: report,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái báo cáo (chỉ dành cho admin)' })
  @ApiParam({ name: 'id', description: 'ID của báo cáo' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostReportDto: UpdatePostReportDto,
  ) {
    const report = await this.postReportsService.update(
      id,
      updatePostReportDto,
    );

    return AppResponse.successWithData({
      data: report,
      message: 'Cập nhật báo cáo thành công',
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa báo cáo (chỉ dành cho admin)' })
  @ApiParam({ name: 'id', description: 'ID của báo cáo' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.postReportsService.remove(id);

    return AppResponse.success('Xóa báo cáo thành công');
  }
}
