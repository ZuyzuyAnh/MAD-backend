import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExerciseQuestionDto {
  @ApiProperty({
    description: 'Nội dung câu hỏi',
    example: 'Đâu là thủ đô của Việt Nam?',
  })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'Các lựa chọn cho câu hỏi',
    example: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'],
  })
  @IsArray()
  options: string[];

  @ApiProperty({
    description: 'Đáp án đúng',
    example: 'Hà Nội',
  })
  @IsString()
  answer: string;

  @ApiProperty({
    description: 'URL của media liên quan đến câu hỏi',
    example: 'https://example.com/images/hanoi.jpg',
  })
  @IsString()
  @IsOptional()
  mediaURL?: string;

  @ApiProperty({
    description: 'ID của bài tập',
    example: 1,
  })
  @IsNumber()
  exerciseId: number;
}
