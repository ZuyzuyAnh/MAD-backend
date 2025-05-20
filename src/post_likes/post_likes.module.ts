import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikesService } from './post_likes.service';
import { PostLikesController } from './post_likes.controller';
import { PostLike } from './entities/post_like.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Post } from 'src/posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike, Post]), NotificationsModule],
  controllers: [PostLikesController],
  providers: [PostLikesService],
})
export class PostLikesModule {}
