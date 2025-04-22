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
import { ExerciseResultsService } from './exercise-results.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateExerciseResultDto } from './dto/create-exercise-result.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ExerciseResult } from './entities/exercise-result.entity';

@ApiTags('Kết quả bài tập')
@Controller('exercise-results')
export class ExerciseResultsController {
  constructor(
    private readonly exerciseResultsService: ExerciseResultsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo kết quả bài tập mới',
    description: 'Lưu kết quả sau khi người dùng hoàn thành một bài tập',
  })
  @ApiBody({
    type: CreateExerciseResultDto,
    description: 'Dữ liệu kết quả bài tập',
  })
  @ApiCreatedResponse({
    description: 'Kết quả bài tập đã được lưu thành công',
    type: ExerciseResult,
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa xác thực - Người dùng chưa đăng nhập',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu không hợp lệ',
  })
  create(
    @Body() createExerciseResultDto: CreateExerciseResultDto,
    @GetUser('sub') userId: number,
  ) {
    return this.exerciseResultsService.create(userId, createExerciseResultDto);
  }
}
