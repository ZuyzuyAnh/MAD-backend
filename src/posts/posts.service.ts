import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { UploadFileService } from 'src/aws/uploadfile.s3.service';
import EntityNotFoundException from 'src/exception/notfound.exception';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    userId: number,
    files?: Express.Multer.File[],
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.uploadFileService.uploadFileToPublicBucket(file),
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    const post = this.postRepository.create({
      ...createPostDto,
      userId,
      imageUrls,
    });

    const savedPost = await this.postRepository.save(post);
  
  // Lấy post với thông tin đầy đủ của user
  return this.postRepository.findOne({
    where: { id: savedPost.id },
    relations: ['user', 'language'],
  });
  }

  async findAll(paginateDto: PaginateDto, languageId?: number) {
    const { page, limit } = paginateDto;

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'commentUser')
      .leftJoinAndSelect('post.likes', 'likes')
      .leftJoinAndSelect('post.user', 'user');

    if (languageId) {
      query.where('post.languageId = :languageId', { languageId });
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

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    files?: Express.Multer.File[],
  ) {
    const post = await this.findOne(id);

    if (!post) {
      throw new EntityNotFoundException('post', 'id', id);
    }

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) =>
        this.uploadFileService.uploadFileToPublicBucket(file),
      );
      const newImageUrls = await Promise.all(uploadPromises);

      post.imageUrls = [...(post.imageUrls || []), ...newImageUrls];
    }

    Object.assign(post, updatePostDto);

    return this.postRepository.save(post);
  }

  async removeImage(id: number, imageUrl: string) {
    const post = await this.findOne(id);

    if (!post) {
      throw new EntityNotFoundException('post', 'id', id);
    }

    if (post.imageUrls && post.imageUrls.includes(imageUrl)) {
      post.imageUrls = post.imageUrls.filter((url) => url !== imageUrl);
      await this.postRepository.save(post);
      return true;
    }

    return false;
  }

  async remove(id: number) {
    const post = await this.findOne(id);

    if (!post) {
      throw new EntityNotFoundException('post', 'id', id);
    }

    return this.postRepository.remove(post);
  }

  async findMyPosts(userId: number, paginateDto: PaginateDto) {
    const { page, limit } = paginateDto;

    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.language', 'language')
      .where('post.userId = :userId', { userId });

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
}
