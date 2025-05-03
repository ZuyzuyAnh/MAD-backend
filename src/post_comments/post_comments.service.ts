import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostComment } from './entities/post_comment.entity';
import { CreatePostCommentDto } from './dto/create-post_comment.dto';
import { UpdatePostCommentDto } from './dto/update-post_comment.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class PostCommentsService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createPostCommentDto: CreatePostCommentDto, userId: number) {
    const postComment = this.postCommentRepository.create({
      ...createPostCommentDto,
      userId,
    });

    const savedComment = await this.postCommentRepository.save(postComment);

    // Lấy thông tin bài viết và thông tin người dùng
    const post = await this.postCommentRepository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.post', 'post')
      .innerJoinAndSelect('comment.user', 'user')
      .where('comment.id = :id', { id: savedComment.id })
      .getOne();

    // Gửi thông báo cho người đăng bài (nếu không phải là người bình luận)
    if (post && post.post.userId !== userId) {
      await this.notificationsService.createCommentNotification(
        post.post.userId, 
        post.user.firstName + ' ' + post.user.lastName,
        post.post.id
      );
    }

    return savedComment;
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
