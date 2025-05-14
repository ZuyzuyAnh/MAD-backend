import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Tiêu đề bài viết',
    example: 'Tiêu đề đã cập nhật',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Nội dung bài viết',
    example: 'Nội dung đã cập nhật',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'Tags của bài viết, phân tách bằng dấu phẩy',
    example: 'tiếng anh,học tập,kinh nghiệm',
    required: false,
  })
  @IsOptional()
  tags?: string[] | string;

  @ApiProperty({
    description: 'Danh sách URL hình ảnh cần xóa',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
    type: [String],
  })
  @IsOptional()
  imagesToRemove?: string[] | string;
}
