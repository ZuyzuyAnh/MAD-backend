import { IsNumber, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateProgressDto {
  @IsNumber()
  @Expose({ name: 'language_id' })
  languageId: number;

  @IsOptional()
  @IsBoolean()
  isCurrentActive?: boolean;
}
