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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PostLike } from './entities/post_like.entity';

@ApiTags('Lượt thích bài viết')
@Controller('post-likes')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Thích một bài viết',
    description: 'Thêm lượt thích của người dùng hiện tại vào bài viết',
  })
  @ApiBody({
    type: CreatePostLikeDto,
    description: 'Dữ liệu để thích bài viết',
  })
  @ApiCreatedResponse({
    description: 'Đã thích bài viết thành công',
    type: PostLike,
  })
  @ApiUnauthorizedResponse({ description: 'Người dùng chưa đăng nhập' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  create(
    @Body() createPostLikeDto: CreatePostLikeDto,
    @GetUser('sub') userId: number,
  ) {
    return this.postLikesService.create(userId, createPostLikeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả lượt thích',
    description: 'Lấy danh sách tất cả lượt thích bài viết',
  })
  @ApiOkResponse({
    description: 'Danh sách lượt thích bài viết',
    type: [PostLike],
  })
  findAll() {
    return this.postLikesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin lượt thích',
    description: 'Lấy thông tin chi tiết về một lượt thích bài viết cụ thể',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của lượt thích bài viết',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Thông tin lượt thích bài viết',
    type: PostLike,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy lượt thích bài viết' })
  findOne(@Param('id') id: string) {
    return this.postLikesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật lượt thích',
    description: 'Cập nhật thông tin lượt thích bài viết',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của lượt thích bài viết',
    type: 'number',
  })
  @ApiBody({
    type: UpdatePostLikeDto,
    description: 'Dữ liệu cập nhật cho lượt thích',
  })
  @ApiOkResponse({
    description: 'Đã cập nhật lượt thích thành công',
    type: PostLike,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy lượt thích bài viết' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  update(
    @Param('id') id: string,
    @Body() updatePostLikeDto: UpdatePostLikeDto,
  ) {
    return this.postLikesService.update(+id, updatePostLikeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa lượt thích',
    description: 'Xóa lượt thích bài viết',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của lượt thích bài viết cần xóa',
    type: 'number',
  })
  @ApiOkResponse({ description: 'Đã xóa lượt thích thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy lượt thích bài viết' })
  remove(@Param('id') id: string) {
    return this.postLikesService.remove(+id);
  }
}
