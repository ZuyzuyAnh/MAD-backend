import { IsInt, IsPositive } from 'class-validator';

export class CreateExamSingleQuestionDto {
  @IsInt()
  @IsPositive()
  examId: number;

  @IsInt()
  @IsPositive()
  questionId: number;

  @IsInt()
  @IsPositive()
  sequence: number;
}
