import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({
    description: 'The name of the language',
    example: 'English',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'URL to the language flag image',
    example: 'https://example.com/flags/en.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  flag_url?: string;
}
