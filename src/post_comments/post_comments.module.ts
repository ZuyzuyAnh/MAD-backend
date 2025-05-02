import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentsService } from './post_comments.service';
import { PostCommentsController } from './post_comments.controller';
import { PostComment } from './entities/post_comment.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostComment]),
    NotificationsModule,
  ],
  controllers: [PostCommentsController],
  providers: [PostCommentsService],
})
export class PostCommentsModule {}