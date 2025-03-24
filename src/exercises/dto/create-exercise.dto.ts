import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ExerciseDifficulty, ExerciseType } from '../entities/exercise.entity';

export class CreateExerciseDto {
  @ApiProperty({
    description: 'Tiêu đề bài tập',
    example: 'Thực hành đọc tiếng Anh cơ bản',
    maxLength: 200,
  })
  @IsString()
  @Length(3, 200)
  title: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về bài tập',
    example:
      'Bài tập giúp nâng cao khả năng đọc hiểu tiếng Anh cho người mới bắt đầu',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Loại bài tập',
    enum: ExerciseType,
    example: ExerciseType.READING,
  })
  @IsEnum(ExerciseType)
  type: ExerciseType;

  @ApiProperty({
    description: 'Độ khó của bài tập',
    enum: ExerciseDifficulty,
    example: ExerciseDifficulty.BEGINNER,
    default: ExerciseDifficulty.BEGINNER,
  })
  @IsEnum(ExerciseDifficulty)
  @IsOptional()
  difficulty?: ExerciseDifficulty = ExerciseDifficulty.BEGINNER;

  @ApiProperty({
    description: 'ID của ngôn ngữ',
    example: 1,
  })
  @IsInt()
  languageId: number;

  @ApiProperty({
    description: 'ID tài nguyên media (hình ảnh, video, âm thanh)',
    example: 5,
    required: false,
  })
  @IsInt()
  @IsOptional()
  mediaId?: number;

  @ApiProperty({
    description: 'Số điểm nhận được khi hoàn thành bài tập',
    example: 10,
    default: 10,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  points?: number = 10;

  @ApiProperty({
    description: 'Trạng thái hoạt động của bài tập',
    example: true,
    default: true,
  })
  @IsOptional()
  active?: boolean = true;
}
