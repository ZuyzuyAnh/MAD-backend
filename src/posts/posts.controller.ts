// src/posts/posts.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import AppResponse from 'src/common/dto/api-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PostOwnerGuard } from 'src/auth/guards/post-owner.guard';

@ApiTags('Bài viết')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Chia sẻ kinh nghiệm học tiếng Anh' },
        content: { type: 'string', example: 'Nội dung bài viết chi tiết...' },
        languageId: { type: 'number', example: 1 },
        tags: { type: 'string', example: 'tiếng anh,học tập,kinh nghiệm' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['title', 'content', 'languageId'],
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  async create(
    @Body() createPostDto: CreatePostDto,
    @GetUser('sub') userId: number,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
  ) {
    const post = await this.postsService.create(
      createPostDto,
      userId,
      files?.files,
    );

    return AppResponse.successWithData({
      data: post,
      message: 'Tạo bài viết thành công',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài viết' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'languageId', required: false, type: Number })
  @ApiQuery({
    name: 'title',
    required: false,
    type: String,
    description: 'Tìm kiếm theo tiêu đề',
  })
  @ApiQuery({
    name: 'content',
    required: false,
    type: String,
    description: 'Tìm kiếm theo nội dung',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    type: String,
    description: 'Tìm kiếm theo tags (phân cách bằng dấu phẩy)',
  })
  async findAll(
    @Query() paginateDto: PaginateDto,
    @Query('languageId') languageId?: number,
    @Query('title') title?: string,
    @Query('content') content?: string,
    @Query('tags') tags?: string,
  ) {
    const result = await this.postsService.findAll(
      paginateDto,
      languageId ? Number(languageId) : undefined,
      title,
      content,
      tags ? tags.split(',') : undefined,
    );

    return AppResponse.successWithData({
      data: result,
    });
  }

  @Get('my-posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách bài viết của bản thân' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'tags', required: false, type: String })
  async findMyPosts(
    @GetUser('sub') userId: number,
    @Query() paginateDto: PaginateDto,
    @Query('title') title?: string,
    @Query('tags') tags?: string,
  ) {
    const result = await this.postsService.findMyPosts(userId, paginateDto);

    return AppResponse.successWithData({
      data: result,
    });
  }

  @Get('hashtags')
  @ApiOperation({ summary: 'Lấy danh sách tất cả các hashtag' })
  async getAllTags() {
    const tags = await this.postsService.getAllTags();

    return AppResponse.successWithData({
      data: tags,
    });
  }

  @Get('hashtags/:tag')
  @ApiOperation({ summary: 'Lấy danh sách bài viết theo hashtag' })
  @ApiParam({ name: 'tag', description: 'Hashtag cần tìm kiếm' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByTag(
    @Param('tag') tag: string,
    @Query() paginateDto: PaginateDto,
  ) {
    const result = await this.postsService.findByTag(tag, paginateDto);

    return AppResponse.successWithData({
      data: result,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết bài viết' })
  @ApiParam({ name: 'id', description: 'ID của bài viết' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);

    return AppResponse.successWithData({
      data: post,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiParam({ name: 'id', description: 'ID của bài viết' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Tiêu đề đã cập nhật' },
        content: { type: 'string', example: 'Nội dung đã cập nhật' },
        tags: { type: 'string', example: 'cập nhật,tags mới' },
        imagesToRemove: {
          type: 'string',
          example:
            'https://example.com/image1.jpg,https://example.com/image2.jpg',
          description:
            'Danh sách URL hình ảnh cần xóa (phân cách bằng dấu phẩy)',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Hình ảnh mới cần thêm vào bài viết',
        },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
  ) {
    const updatedPost = await this.postsService.update(
      id,
      updatePostDto,
      files?.files,
    );

    return AppResponse.successWithData({
      data: updatedPost,
      message: 'Cập nhật bài viết thành công',
    });
  }

  @Delete(':id/images/:imageUrl')
  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa hình ảnh khỏi bài viết' })
  @ApiParam({ name: 'id', description: 'ID của bài viết' })
  @ApiParam({ name: 'imageUrl', description: 'URL của hình ảnh cần xóa' })
  async removeImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageUrl') imageUrl: string,
  ) {
    const result = await this.postsService.removeImage(id, imageUrl);

    return AppResponse.successWithData({
      data: { success: result },
      message: result ? 'Xóa hình ảnh thành công' : 'Không tìm thấy hình ảnh',
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PostOwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài viết' })
  @ApiParam({ name: 'id', description: 'ID của bài viết' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.postsService.remove(id);

    return AppResponse.success('Xóa bài viết thành công');
  }

  @Get('popular')
  @ApiOperation({ summary: 'Lấy danh sách bài viết phổ biến' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng bài viết trả về',
  })
  async getPopularPosts(@Query('limit') limit?: number) {
    const posts = await this.postsService.getPopularPosts(limit ? +limit : 10);

    return AppResponse.successWithData({
      data: posts,
    });
  }

  @Get('trending')
  @ApiOperation({ summary: 'Lấy danh sách bài viết theo xu hướng gần đây' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Số ngày gần đây',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng bài viết trả về',
  })
    
  async getTrendingPosts(
    @Query('days') days?: number,
    @Query('limit') limit?: number,
  ) {
    const posts = await this.postsService.getTrendingPosts(
      days ? +days : 7,
      limit ? +limit : 10,
    );

    return AppResponse.successWithData({
      data: posts,
    });
  }
}
