import { Module } from '@nestjs/common';
import { PostLikesService } from './post_likes.service';
import { PostLikesController } from './post_likes.controller';

@Module({
  controllers: [PostLikesController],
  providers: [PostLikesService],
})
export class PostLikesModule {}
