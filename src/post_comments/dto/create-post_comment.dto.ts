import { IsInt, IsString, MinLength } from 'class-validator';

export class CreatePostCommentDto {
  @IsInt()
  postId: number;

  @IsString()
  @MinLength(1)
  content: string;
}
