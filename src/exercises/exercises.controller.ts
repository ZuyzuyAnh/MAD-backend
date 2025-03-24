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
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';
import AppResponse from '../common/dto/api-response.dto';
import { PaginateDto } from '../common/dto/paginate.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ExerciseType } from './entities/exercise.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';

@ApiTags('Bài tập')
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo bài tập mới' })
  @ApiResponse({
    status: 201,
    description: 'Đã tạo bài tập thành công',
    schema: {
      example: {
        data: {
          id: 1,
          title: 'Thực hành đọc tiếng Anh cơ bản',
          description:
            'Bài tập giúp nâng cao khả năng đọc hiểu tiếng Anh cho người mới bắt đầu',
          type: 'reading',
          difficulty: 'beginner',
          languageId: 1,
          mediaId: null,
          points: 10,
          active: true,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
        },
        statusCode: 201,
        message: 'Tạo bài tập thành công',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async create(@Body() createExerciseDto: CreateExerciseDto) {
    const exercise = await this.exercisesService.create(createExerciseDto);
    return AppResponse.success({
      data: exercise,
      message: 'Tạo bài tập thành công',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài tập' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng kết quả mỗi trang',
    type: Number,
  })
  @ApiQuery({
    name: 'languageId',
    required: false,
    description: 'ID của ngôn ngữ',
    type: Number,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Loại bài tập',
    enum: ExerciseType,
  })
  @ApiQuery({
    name: 'active',
    required: false,
    description: 'Trạng thái kích hoạt',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài tập',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'Thực hành đọc tiếng Anh cơ bản',
            description:
              'Bài tập giúp nâng cao khả năng đọc hiểu tiếng Anh cho người mới bắt đầu',
            type: 'reading',
            difficulty: 'beginner',
            languageId: 1,
            language: {
              id: 1,
              name: 'Tiếng Anh',
              code: 'en',
              // ... more language fields
            },
            mediaId: null,
            points: 10,
            active: true,
            createdAt: '2023-08-01T12:00:00.000Z',
            updatedAt: '2023-08-01T12:00:00.000Z',
          },
          // more exercises
        ],
        meta: {
          total: 15,
          page: 1,
          limit: 10,
          totalPages: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        },
        statusCode: 200,
        message: 'Success',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  async findAll(
    @Query() paginateDto: PaginateDto,
    @Query('languageId') languageId?: number,
    @Query('type') type?: string,
    @Query('active') active?: boolean,
  ) {
    const exercises = await this.exercisesService.findAll(
      paginateDto,
      languageId,
      type,
      active,
    );
    return AppResponse.success({
      data: exercises,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin một bài tập' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin bài tập',
    schema: {
      example: {
        data: {
          id: 1,
          title: 'Thực hành đọc tiếng Anh cơ bản',
          description:
            'Bài tập giúp nâng cao khả năng đọc hiểu tiếng Anh cho người mới bắt đầu',
          type: 'reading',
          difficulty: 'beginner',
          languageId: 1,
          language: {
            id: 1,
            name: 'Tiếng Anh',
            code: 'en',
            // ... more language fields
          },
          mediaId: null,
          points: 10,
          active: true,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
        },
        statusCode: 200,
        message: 'Success',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài tập' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const exercise = await this.exercisesService.findOne(id);
    return AppResponse.success({
      data: exercise,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin bài tập' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin bài tập sau khi cập nhật',
    schema: {
      example: {
        data: {
          id: 1,
          title: 'Thực hành đọc tiếng Anh nâng cao',
          description: 'Bài tập giúp nâng cao khả năng đọc hiểu tiếng Anh',
          type: 'reading',
          difficulty: 'intermediate',
          languageId: 1,
          mediaId: null,
          points: 15,
          active: true,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-02T12:00:00.000Z',
        },
        statusCode: 200,
        message: 'Cập nhật bài tập thành công',
        success: true,
        timestamp: '2023-08-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài tập' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    const exercise = await this.exercisesService.update(id, updateExerciseDto);
    return AppResponse.success({
      data: exercise,
      message: 'Cập nhật bài tập thành công',
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AdminOnly()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài tập' })
  @ApiResponse({
    status: 200,
    description: 'Đã xóa bài tập thành công',
    schema: {
      example: {
        data: null,
        statusCode: 200,
        message: 'Xóa bài tập thành công',
        success: true,
        timestamp: '2023-08-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài tập' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.exercisesService.remove(id);
    return AppResponse.success({
      data: null,
      message: 'Xóa bài tập thành công',
    });
  }
}
