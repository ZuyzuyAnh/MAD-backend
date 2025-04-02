import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdateProgressDto {
  @ApiProperty({
    description: 'ID của khóa học',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  courseId?: number;

  @ApiProperty({
    description: 'ID của bài học',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  lessonId?: number;

  @ApiProperty({
    description: 'ID của ngôn ngữ',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  languageId?: number;

  @ApiProperty({
    description: 'Đánh dấu tiến độ đang hoạt động',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isCurrentActive?: boolean;
}
