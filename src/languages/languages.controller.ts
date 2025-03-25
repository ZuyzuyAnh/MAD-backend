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
} from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PaginateDto } from '../common/dto/paginate.dto';
import AppResponse from '../common/dto/api-response.dto';
import { AdminOnly } from '../auth/decorators/admin-only.decorator';

@ApiTags('Ngôn ngữ')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @AdminOnly()
  @ApiOperation({ summary: 'Tạo ngôn ngữ mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo ngôn ngữ thành công',
    schema: {
      example: {
        data: {
          id: 1,
          name: 'Tiếng Anh',
          flagUrl: 'https://example.com/flags/en.png',
          active: true,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-01T12:00:00.000Z',
        },
        statusCode: 201,
        message: 'Tạo ngôn ngữ thành công',
        success: true,
        timestamp: '2023-08-01T12:00:00.000Z',
      },
    },
  })
  async create(@Body() createLanguageDto: CreateLanguageDto) {
    const language = await this.languagesService.create(createLanguageDto);
    return AppResponse.success({
      data: language,
      message: 'Tạo ngôn ngữ thành công',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách ngôn ngữ' })
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
    name: 'name',
    required: false,
    description: 'Tìm kiếm theo tên ngôn ngữ',
    type: String,
  })
  @ApiQuery({
    name: 'active',
    required: false,
    description: 'Lọc theo trạng thái kích hoạt',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách ngôn ngữ',
    schema: {
      example: {
        data: {
          data: [
            {
              id: 1,
              name: 'Tiếng Anh',
              flagUrl: 'https://example.com/flags/en.png',
              active: true,
              createdAt: '2023-08-01T12:00:00.000Z',
              updatedAt: '2023-08-01T12:00:00.000Z',
            },
          ],
          meta: {
            total: 5,
            page: 1,
            limit: 10,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
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
    @Query('name') name?: string,
    @Query('active') active?: boolean,
  ) {
    const result = await this.languagesService.findAll(
      paginateDto,
      name,
      active,
    );
    return AppResponse.success({
      data: result,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin một ngôn ngữ' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin ngôn ngữ',
    schema: {
      example: {
        data: {
          id: 1,
          name: 'Tiếng Anh',
          flagUrl: 'https://example.com/flags/en.png',
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
  @ApiResponse({ status: 404, description: 'Không tìm thấy ngôn ngữ' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const language = await this.languagesService.findOne(id);
    return AppResponse.success({
      data: language,
    });
  }

  @Patch(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Cập nhật thông tin ngôn ngữ' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật ngôn ngữ thành công',
    schema: {
      example: {
        data: {
          id: 1,
          name: 'Tiếng Anh (Đã cập nhật)',
          flagUrl: 'https://example.com/flags/en_updated.png',
          active: true,
          createdAt: '2023-08-01T12:00:00.000Z',
          updatedAt: '2023-08-02T12:00:00.000Z',
        },
        statusCode: 200,
        message: 'Cập nhật ngôn ngữ thành công',
        success: true,
        timestamp: '2023-08-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ngôn ngữ' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    const language = await this.languagesService.update(id, updateLanguageDto);
    return AppResponse.success({
      data: language,
      message: 'Cập nhật ngôn ngữ thành công',
    });
  }

  @Delete(':id')
  @AdminOnly()
  @ApiOperation({ summary: 'Xóa ngôn ngữ' })
  @ApiResponse({
    status: 200,
    description: 'Xóa ngôn ngữ thành công',
    schema: {
      example: {
        data: null,
        statusCode: 200,
        message: 'Xóa ngôn ngữ thành công',
        success: true,
        timestamp: '2023-08-02T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ngôn ngữ' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.languagesService.remove(id);
    return AppResponse.success({
      data: null,
      message: 'Xóa ngôn ngữ thành công',
    });
  }
}
