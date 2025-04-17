import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostLikeDto } from './dto/create-post_like.dto';
import { UpdatePostLikeDto } from './dto/update-post_like.dto';
import { PostLike } from './entities/post_like.entity';

@Injectable()
export class PostLikesService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
  ) {}

  async create(createPostLikeDto: CreatePostLikeDto): Promise<PostLike> {
    const postLike = this.postLikeRepository.create(createPostLikeDto);
    return this.postLikeRepository.save(postLike);
  }

  async findAll(): Promise<PostLike[]> {
    return this.postLikeRepository.find();
  }

  async findOne(id: number) {
    return this.postLikeRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePostLikeDto: UpdatePostLikeDto) {
    await this.postLikeRepository.update(id, updatePostLikeDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.postLikeRepository.delete(id);
  }
}
