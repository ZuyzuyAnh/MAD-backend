import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'Nguyen',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsString()
  @Length(2, 50)
  @IsOptional()
  @Expose({ name: 'first_name' })
  firstName?: string;

  @ApiProperty({
    description: 'Họ của người dùng',
    example: 'Van A',
    minLength: 2,
    maxLength: 50,
    required: false,
  })
  @IsString()
  @Length(2, 50)
  @IsOptional()
  @Expose({ name: 'last_name' })
  lastName?: string;

  @ApiProperty({
    description: 'URL hình ảnh đại diện',
    required: false,
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  profile_image_url?: string;
}
