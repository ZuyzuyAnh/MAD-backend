import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { CreateProgressDto } from './create-progress.dto';

export class UpdateProgressDto extends PartialType(CreateProgressDto) {}
