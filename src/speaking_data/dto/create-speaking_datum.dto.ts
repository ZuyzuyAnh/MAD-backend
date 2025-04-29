import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class SpeakingDataContent {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Câu luyện nói',
    example: 'How are you today?',
  })
  sentence: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Bản dịch của câu luyện nói',
    example: 'Bạn khỏe không hôm nay?',
  })
  translation: string;
}

export class CreateSpeakingDatumDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpeakingDataContent)
  @ApiProperty({
    description: 'Dữ liệu câu luyện nói',
    type: [SpeakingDataContent],
    example: [
      {
        sentence: 'How are you today?',
        translation: 'Bạn khỏe không hôm nay?',
      },
      {
        sentence: 'What is your name?',
        translation: 'Tên bạn là gì?',
      },
    ],
  })
  data: SpeakingDataContent[];

  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'ID của bài tập',
    example: 1,
    minimum: 1,
  })
  exerciseId: number;
}
