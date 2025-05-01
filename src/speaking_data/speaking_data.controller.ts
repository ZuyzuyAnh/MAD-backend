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
  Query,
} from '@nestjs/common';
import { SpeakingDataService } from './speaking_data.service';
import { CreateSpeakingDatumDto } from './dto/create-speaking_datum.dto';
import { UpdateSpeakingDatumDto } from './dto/update-speaking_datum.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  getSchemaPath,
} from '@nestjs/swagger';
import AppResponse from 'src/common/dto/api-response.dto';
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SpeakingDatum } from './entities/speaking_datum.entity';

@ApiTags('Dữ liệu luyện nói')
@Controller('speaking-data')
export class SpeakingDataController {
  constructor(private readonly speakingDataService: SpeakingDataService) {}

  @Post()
  @AdminOnly()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới dữ liệu luyện nói' })
  @ApiBody({
    type: CreateSpeakingDatumDto,
    description: 'Dữ liệu luyện nói mới',
    examples: {
      example1: {
        summary: 'Mẫu dữ liệu luyện nói',
        value: {
          data: [
            {
              sentence: 'How are you today?',
              translation: 'Bạn khỏe không hôm nay?',
            },
            {
              sentence: 'What is your name?',
              translation: 'Tên bạn là gì?',
            },
          ],
          exerciseId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo dữ liệu luyện nói thành công',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: {
          type: 'string',
          example: 'Tạo dữ liệu luyện nói thành công',
        },
        data: { $ref: getSchemaPath(SpeakingDatum) },
      },
    },
  })
  async create(@Body() createSpeakingDatumDto: CreateSpeakingDatumDto) {
    const speakingDatum = await this.speakingDataService.create(
      createSpeakingDatumDto,
    );
    return AppResponse.successWithData({
      data: speakingDatum,
      message: 'Tạo dữ liệu luyện nói thành công',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách dữ liệu luyện nói' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách dữ liệu luyện nói',
  })
  async findAll() {
    const speakingData = await this.speakingDataService.findAll();
    return AppResponse.successWithData({
      data: speakingData,
    });
  }

  @Get('exercise/:exerciseId')
  @ApiOperation({ summary: 'Lấy danh sách dữ liệu luyện nói theo bài tập' })
  @ApiParam({ name: 'exerciseId', description: 'ID của bài tập' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách dữ liệu luyện nói cho bài tập',
  })
  async findByExerciseId(
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
  ) {
    const speakingData =
      await this.speakingDataService.findByExerciseId(exerciseId);
    return AppResponse.successWithData({
      data: speakingData,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin một dữ liệu luyện nói' })
  @ApiParam({ name: 'id', description: 'ID của dữ liệu luyện nói' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin dữ liệu luyện nói',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy dữ liệu luyện nói',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const speakingDatum = await this.speakingDataService.findOne(id);
    return AppResponse.successWithData({
      data: speakingDatum,
    });
  }

  @Patch(':id')
  @AdminOnly()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật dữ liệu luyện nói' })
  @ApiParam({ name: 'id', description: 'ID của dữ liệu luyện nói' })
  @ApiBody({ type: UpdateSpeakingDatumDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật dữ liệu luyện nói thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy dữ liệu luyện nói',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpeakingDatumDto: UpdateSpeakingDatumDto,
  ) {
    const updatedSpeakingDatum = await this.speakingDataService.update(
      id,
      updateSpeakingDatumDto,
    );
    return AppResponse.successWithData({
      data: updatedSpeakingDatum,
      message: 'Cập nhật dữ liệu luyện nói thành công',
    });
  }

  @Delete(':id')
  @AdminOnly()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa dữ liệu luyện nói' })
  @ApiParam({ name: 'id', description: 'ID của dữ liệu luyện nói' })
  @ApiResponse({
    status: 200,
    description: 'Xóa dữ liệu luyện nói thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy dữ liệu luyện nói',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.speakingDataService.remove(id);
    return AppResponse.successWithData({
      data: null,
      message: 'Xóa dữ liệu luyện nói thành công',
    });
  }
}
