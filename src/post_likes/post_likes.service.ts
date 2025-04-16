import { Injectable } from '@nestjs/common';
import { CreatePostLikeDto } from './dto/create-post_like.dto';
import { UpdatePostLikeDto } from './dto/update-post_like.dto';

@Injectable()
export class PostLikesService {
  create(createPostLikeDto: CreatePostLikeDto) {
    return 'This action adds a new postLike';
  }

  findAll() {
    return `This action returns all postLikes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postLike`;
  }

  update(id: number, updatePostLikeDto: UpdatePostLikeDto) {
    return `This action updates a #${id} postLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} postLike`;
  }
}
