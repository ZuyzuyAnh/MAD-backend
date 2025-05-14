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
import { PostCommentsService } from './post_comments.service';
import { CreatePostCommentDto } from './dto/create-post_comment.dto';
import { UpdatePostCommentDto } from './dto/update-post_comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import AppResponse from 'src/common/dto/api-response.dto';

@ApiTags('Bình luận bài viết')
@Controller('post-comments')
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo bình luận mới hoặc trả lời bình luận' })
  create(
    @Body() createPostCommentDto: CreatePostCommentDto,
    @GetUser('sub') userId: number,
  ) {
    return this.postCommentsService.create(createPostCommentDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả bình luận gốc' })
  async findAll() {
    const comments = await this.postCommentsService.findAll();
    return AppResponse.successWithData({
      data: comments,
    });
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Lấy tất cả bình luận của một bài viết' })
  @ApiParam({ name: 'postId', description: 'ID của bài viết' })
  async findByPostId(@Param('postId') postId: string) {
    const comments = await this.postCommentsService.findByPostId(+postId);
    return AppResponse.successWithData({
      data: comments,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postCommentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostCommentDto: UpdatePostCommentDto,
  ) {
    return this.postCommentsService.update(+id, updatePostCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postCommentsService.remove(+id);
  }
}
