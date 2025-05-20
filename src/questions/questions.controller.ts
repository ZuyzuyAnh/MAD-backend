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
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  getSchemaPath,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PaginateDto } from '../common/dto/paginate.dto';
import AppResponse from '../common/dto/api-response.dto';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Question, QuestionType } from './entities/question.entity';

@ApiTags('Câu hỏi')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @AdminOnly()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo câu hỏi mới',
    description:
      'Tạo một câu hỏi mới cho bài tập hoặc bài kiểm tra. Yêu cầu quyền ADMIN.',
  })
  @ApiBody({
    type: CreateQuestionDto,
    description: 'Dữ liệu để tạo câu hỏi mới',
  })
  @ApiCreatedResponse({
    description: 'Câu hỏi đã được tạo thành công',
    type: Question,
  })
  @ApiUnauthorizedResponse({ description: 'Người dùng chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Người dùng không có quyền Admin' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    const question = await this.questionsService.create(createQuestionDto);
    return AppResponse.successWithData({
      data: question,
      message: 'Tạo câu hỏi thành công',
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách câu hỏi',
    description:
      'Trả về danh sách các câu hỏi có phân trang, có thể lọc theo bài tập hoặc bài kiểm tra.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (bắt đầu từ 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng kết quả tối đa mỗi trang',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'exerciseId',
    required: false,
    description: 'ID của bài tập cần lọc',
    type: Number,
  })
  @ApiQuery({
    name: 'examId',
    required: false,
    description: 'ID của bài kiểm tra cần lọc',
    type: Number,
  })
  @ApiQuery({
    name: 'languageId',
    description: 'ID của ngôn ngữ cần lọc',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'type',
    description: 'Loại câu hỏi cần lọc',
    enum: QuestionType,
    required: false,
  })
  @ApiOkResponse({
    description: 'Danh sách câu hỏi đã được tìm thấy',
    type: [Question],
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  async findAll(
    @Query() paginateDto: PaginateDto,
    @Query('exerciseId') exerciseId?: number,
    @Query('examId') examId?: number,
  ) {
    const result = await this.questionsService.findAll(
      paginateDto,
      exerciseId,
      examId,
    );
    return AppResponse.successWithData({
      data: result,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin một câu hỏi',
    description: 'Trả về thông tin chi tiết của một câu hỏi dựa trên ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của câu hỏi',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Câu hỏi đã được tìm thấy',
    type: Question,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy câu hỏi' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy câu hỏi',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const question = await this.questionsService.findOne(id);
    return AppResponse.successWithData({
      data: question,
    });
  }

  @Patch(':id')
  @AdminOnly()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật thông tin câu hỏi',
    description:
      'Cập nhật thông tin cho một câu hỏi hiện có. Yêu cầu quyền ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của câu hỏi cần cập nhật',
    type: Number,
    example: 1,
  })
  @ApiBody({
    type: UpdateQuestionDto,
    description: 'Dữ liệu cập nhật cho câu hỏi',
  })
  @ApiOkResponse({
    description: 'Câu hỏi đã được cập nhật thành công',
    type: Question,
  })
  @ApiUnauthorizedResponse({ description: 'Người dùng chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Người dùng không có quyền Admin' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy câu hỏi' })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy câu hỏi',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const question = await this.questionsService.update(id, updateQuestionDto);
    return AppResponse.successWithData({
      data: question,
      message: 'Cập nhật câu hỏi thành công',
    });
  }

  @Delete(':id')
  @AdminOnly()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa câu hỏi',
    description: 'Xóa một câu hỏi dựa trên ID. Yêu cầu quyền ADMIN.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của câu hỏi cần xóa',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({ description: 'Câu hỏi đã được xóa thành công' })
  @ApiUnauthorizedResponse({ description: 'Người dùng chưa đăng nhập' })
  @ApiForbiddenResponse({ description: 'Người dùng không có quyền Admin' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Xóa câu hỏi thành công',
    schema: {
      allOf: [
        { $ref: getSchemaPath(AppResponse) },
        {
          properties: {
            data: { type: 'null', example: null },
            statusCode: { type: 'number', example: 200 },
            message: { type: 'string', example: 'Xóa câu hỏi thành công' },
            success: { type: 'boolean', example: true },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy câu hỏi',
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.questionsService.remove(id);
    return AppResponse.successWithData({
      data: null,
      message: 'Xóa câu hỏi thành công',
    });
  }
}
