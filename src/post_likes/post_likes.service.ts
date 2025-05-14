import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostLikeDto } from './dto/create-post_like.dto';
import { UpdatePostLikeDto } from './dto/update-post_like.dto';
import { PostLike } from './entities/post_like.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Post } from 'src/posts/entities/post.entity';
import { NotificationType } from 'src/notifications/entities/notification.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostLikesService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    userId: number,
    createPostLikeDto: CreatePostLikeDto,
  ): Promise<PostLike> {
    const postLike = this.postLikeRepository.create({
      ...createPostLikeDto,
      userId,
    });

    const savedLike = await this.postLikeRepository.save(postLike);

    const post = await this.postRepository.findOne({
      where: { id: createPostLikeDto.postId },
      relations: ['user'],
    });

    if (post && post.userId !== userId) {
      const liker = await this.getUserInfo(userId);
      const likerName = liker
        ? `${liker.firstName} ${liker.lastName}`
        : 'Một người dùng';

      await this.notificationsService.createLikeNotification(
        post.userId,
        likerName,
        post.id,
        post.title,
      );
    }

    return savedLike;
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

  async findUsersByPostId(postId: number): Promise<User[]> {
    const postLikes = await this.postLikeRepository.find({
      where: { postId },
      relations: ['user'],
    });

    return postLikes.map((like) => like.user);
  }

  private async getUserInfo(userId: number) {
    const postLike = await this.postLikeRepository
      .createQueryBuilder('like')
      .innerJoinAndSelect('like.user', 'user')
      .where('like.userId = :userId', { userId })
      .getOne();

    return postLike?.user;
  }
}
