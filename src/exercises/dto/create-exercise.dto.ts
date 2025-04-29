import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { ExerciseDifficulty, ExerciseType } from '../entities/exercise.entity';

export class CreateExerciseDto {
  @ApiProperty({
    description: 'Tiêu đề bài tập',
    example: 'Thực hành ngữ pháp tiếng Anh cơ bản',
    maxLength: 200,
  })
  @IsString()
  @Length(3, 200)
  title: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về bài tập',
    example:
      'Bài tập giúp nâng cao khả năng sử dụng ngữ pháp tiếng Anh cho người mới bắt đầu',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Loại bài tập',
    enum: ExerciseType,
    example: ExerciseType.GRAMMAR,
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

  @IsOptional()
  theory?: string;

  audioText?: string;

  @ApiProperty({
    description: 'ID của ngôn ngữ',
    example: 1,
  })
  @IsInt()
  languageId: number;
}
