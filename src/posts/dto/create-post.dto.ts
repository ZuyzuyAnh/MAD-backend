import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({
    description: 'Tiêu đề bài viết',
    example: 'Chia sẻ kinh nghiệm học tiếng Anh',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Nội dung bài viết',
    example: 'Nội dung chi tiết của bài viết...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'ID của ngôn ngữ bài viết',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  languageId: number;

  @ApiProperty({
    description: 'Tags của bài viết, phân tách bằng dấu phẩy',
    example: 'tiếng anh,học tập,kinh nghiệm',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
    return value;
  })
  tags?: string[];
}
