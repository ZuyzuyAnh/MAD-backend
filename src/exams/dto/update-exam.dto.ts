import { PartialType } from '@nestjs/mapped-types';
import { CreateExamDto } from './create-exam.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ExamType } from '../entities/exam.entity';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateExamDto extends PartialType(CreateExamDto) {
  @ApiProperty({
    description: 'Tiêu đề bài kiểm tra',
    example: 'Kiểm tra ngữ pháp tiếng Anh tuần 3 (cập nhật)',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Loại bài kiểm tra',
    enum: ExamType,
    example: ExamType.WEEKLY,
    required: false,
  })
  @IsEnum(ExamType, {
    message: 'Loại bài kiểm tra phải là weekly hoặc comprehensive',
  })
  @IsOptional()
  type?: ExamType;

  @ApiProperty({
    description: 'Tuần của bài kiểm tra (chỉ áp dụng nếu type là weekly)',
    example: 3,
    required: false,
  })
  @IsInt({ message: 'Tuần phải là số nguyên' })
  @Min(1, { message: 'Tuần phải lớn hơn hoặc bằng 1' })
  @IsOptional()
  week?: number;

  @ApiProperty({
    description: 'ID của ngôn ngữ',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  languageId?: number;

  @ApiProperty({
    description: 'Mô tả bài kiểm tra',
    example: 'Bài kiểm tra ngữ pháp cơ bản (đã cập nhật)',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
