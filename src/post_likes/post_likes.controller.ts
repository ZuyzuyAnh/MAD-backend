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
import { PostLikesService } from './post_likes.service';
import { CreatePostLikeDto } from './dto/create-post_like.dto';
import { UpdatePostLikeDto } from './dto/update-post_like.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('post-likes')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createPostLikeDto: CreatePostLikeDto,
    @GetUser('sub') userId: number,
  ) {
    return this.postLikesService.create(userId, createPostLikeDto);
  }

  @Get()
  findAll() {
    return this.postLikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postLikesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostLikeDto: UpdatePostLikeDto,
  ) {
    return this.postLikesService.update(+id, updatePostLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postLikesService.remove(+id);
  }
}
