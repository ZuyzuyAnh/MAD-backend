import { IsInt, IsPositive } from 'class-validator';

export class CreateVocabGameResultDto {
  @IsInt()
  @IsPositive()
  topicId: number;

  @IsInt()
  @IsPositive()
  time: number;
}
