import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async findAll(paginateDto: PaginateDto, languageId?: number) {
    const { page, limit } = paginateDto;

    const query = this.postRepository.createQueryBuilder('post');

    if (languageId) {
      query.where('post.language = :language', { languageId });
    }

    query.skip((page - 1) * limit).take(limit);
    query.orderBy('post.createdAt', 'DESC');

    const [posts, total] = await query.getManyAndCount();

    return {
      data: posts,
      meta: {
        totalItems: total,
        itemCount: posts.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['user', 'comments'],
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }
}
