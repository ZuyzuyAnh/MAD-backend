import { IsInt, IsPositive } from 'class-validator';

export class CreateExamSectionItemDto {
  @IsInt()
  @IsPositive()
  examSectionId: number;

  @IsInt()
  @IsPositive()
  questionId: number;

  @IsInt()
  @IsPositive()
  sequence: number;
}
