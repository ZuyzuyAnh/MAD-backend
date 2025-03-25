import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLanguageDto {
  @ApiProperty({
    description: 'Tên ngôn ngữ',
    example: 'Tiếng Anh',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Đường dẫn hình ảnh đại diện ngôn ngữ',
    example: 'https://example.com/flags/en.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  flagUrl?: string;

  @ApiProperty({
    description: 'Trạng thái hoạt động của ngôn ngữ',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean = true;
}
