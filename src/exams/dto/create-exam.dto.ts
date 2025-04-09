// src/exams/dto/create-exam.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { ExamType } from '../entities/exam.entity';

export class CreateExamDto {
  @ApiProperty({
    description: 'Tiêu đề bài kiểm tra',
    example: 'Kiểm tra ngữ pháp tiếng Anh tuần 3',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Loại bài kiểm tra',
    enum: ExamType,
    example: ExamType.WEEKLY,
  })
  @IsEnum(ExamType, {
    message: 'Loại bài kiểm tra phải là weekly hoặc comprehensive',
  })
  @IsNotEmpty()
  type: ExamType;

  @ApiProperty({
    description: 'Tuần của bài kiểm tra (chỉ bắt buộc nếu type là weekly)',
    example: 3,
    required: false,
  })
  @ValidateIf((o) => o.type === ExamType.WEEKLY)
  @IsInt({ message: 'Tuần phải là số nguyên' })
  @Min(1, { message: 'Tuần phải lớn hơn hoặc bằng 1' })
  @IsNotEmpty({
    message: 'Tuần không được để trống cho bài kiểm tra hàng tuần',
  })
  week?: number;

  @ApiProperty({
    description: 'ID của ngôn ngữ',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  languageId: number;
}
