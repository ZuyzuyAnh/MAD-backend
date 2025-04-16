import { Module } from '@nestjs/common';
import { PostCommentsService } from './post_comments.service';
import { PostCommentsController } from './post_comments.controller';

@Module({
  controllers: [PostCommentsController],
  providers: [PostCommentsService],
})
export class PostCommentsModule {}
