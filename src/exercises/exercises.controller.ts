import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import AppResponse from '../common/dto/api-response.dto';
import { PaginateDto } from '../common/dto/paginate.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { ExerciseDifficulty, ExerciseType } from './entities/exercise.entity';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Bài tập')
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('completed')
  @UseGuards(JwtAuthGuard)
  async countCompletedExercises(@GetUser('sub') userId: number) {
    const count = await this.exercisesService.countCompletedExercises(userId);
    return AppResponse.successWithData({
      data: count,
    });
  }

  @Get('overview')
  @UseGuards(JwtAuthGuard)
  async getOverview(@GetUser('sub') userId: number) {
    const overview = await this.exercisesService.getExerciseOverView(userId);
    return AppResponse.successWithData({
      data: overview,
    });
  }

  @Post()
  @AdminOnly()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
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
          type: ExerciseType.GRAMMAR,
          difficulty: ExerciseDifficulty.BEGINNER,
          languageId: 1,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
        },
        statusCode: 201,
        message: 'Tạo bài tập thành công',
        success: true,
      },
    },
  })
  async create(
    @Body() createExerciseDto: CreateExerciseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const exercise = await this.exercisesService.create(
      createExerciseDto,
      file,
    );
    return AppResponse.successWithData({
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
    name: 'difficulty',
    required: false,
    description: 'Độ khó của bài tập',
    enum: ExerciseDifficulty,
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
            type: ExerciseType.GRAMMAR,
            difficulty: ExerciseDifficulty.BEGINNER,
            languageId: 1,
            createdAt: '2023-08-01T12:00:00.000Z',
            updatedAt: '2023-08-01T12:00:00.000Z',
          },
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
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @GetUser('sub') userId: number,
    @Query() paginateDto: PaginateDto,
    @Query('type') type: string,
    @Query('difficulty') difficulty?: string,
  ) {
    const exercises = await this.exercisesService.findAll(
      paginateDto,
      userId,
      type,
      difficulty,
    );
    return AppResponse.successWithData({
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
          type: ExerciseType.GRAMMAR,
          difficulty: ExerciseDifficulty.BEGINNER,
          languageId: 1,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
        },
        statusCode: 200,
        message: 'Success',
        success: true,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài tập' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const exercise = await this.exercisesService.findOne(id);
    return AppResponse.successWithData({
      data: exercise,
    });
  }

  @Patch(':id')
  @AdminOnly()
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
          type: ExerciseType.GRAMMAR,
          difficulty: ExerciseDifficulty.INTERMEDIATE,
          languageId: 1,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-02T12:00:00.000Z',
        },
        statusCode: 200,
        message: 'Cập nhật bài tập thành công',
        success: true,
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    const exercise = await this.exercisesService.update(id, updateExerciseDto);
    return AppResponse.successWithData({
      data: exercise,
      message: 'Cập nhật bài tập thành công',
    });
  }

  @Delete(':id')
  @AdminOnly()
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
      },
    },
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.exercisesService.remove(id);
    return AppResponse.successWithData({
      data: null,
      message: 'Xóa bài tập thành công',
    });
  }
}
