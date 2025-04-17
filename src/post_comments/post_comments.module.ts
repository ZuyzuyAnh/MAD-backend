import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentsService } from './post_comments.service';
import { PostCommentsController } from './post_comments.controller';
import { PostComment } from './entities/post_comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostComment])],
  controllers: [PostCommentsController],
  providers: [PostCommentsService],
})
export class PostCommentsModule {}
