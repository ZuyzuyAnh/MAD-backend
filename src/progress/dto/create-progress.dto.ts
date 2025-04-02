import { IsNumber, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgressDto {
  @IsNumber()
  languageId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastActivity?: Date;

  @IsOptional()
  @IsBoolean()
  isCurrentActive?: boolean;
}
