import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostComment } from './entities/post_comment.entity';
import { CreatePostCommentDto } from './dto/create-post_comment.dto';
import { UpdatePostCommentDto } from './dto/update-post_comment.dto';

@Injectable()
export class PostCommentsService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
  ) {}

  create(createPostCommentDto: CreatePostCommentDto) {
    const postComment = this.postCommentRepository.create(createPostCommentDto);
    return this.postCommentRepository.save(postComment);
  }

  findAll() {
    return this.postCommentRepository.find();
  }

  findOne(id: number) {
    return this.postCommentRepository.findOne({ where: { id } });
  }

  update(id: number, updatePostCommentDto: UpdatePostCommentDto) {
    return this.postCommentRepository.update(id, updatePostCommentDto);
  }

  remove(id: number) {
    return this.postCommentRepository.delete(id);
  }
}
