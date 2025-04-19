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

@Controller('post-comments')
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPostCommentDto: CreatePostCommentDto,
    @GetUser('sub') userId: number,
  ) {
    return this.postCommentsService.create(createPostCommentDto, userId);
  }

  @Get()
  findAll() {
    return this.postCommentsService.findAll();
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
