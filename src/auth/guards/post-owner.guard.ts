/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/posts/guards/post-owner.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;
    const postId = parseInt(request.params.id, 10);

    const post = await this.postsService.findOne(postId);

    if (!post) {
      throw new ForbiddenException('Post không tồn tại');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện hành động này với post',
      );
    }

    return true;
  }
}
