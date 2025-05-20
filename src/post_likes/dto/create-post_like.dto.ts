import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostLikeDto {
  @ApiProperty({
    description: 'ID của bài viết cần thích',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
