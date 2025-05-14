import { IsInt, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostCommentDto {
  @ApiProperty({
    description: 'ID của bài viết',
    example: 1,
  })
  @IsInt()
  postId: number;

  @ApiProperty({
    description: 'Nội dung bình luận',
    example: 'Bài viết rất hay!',
  })
  @IsString()
  @MinLength(1)
  content: string;
}
