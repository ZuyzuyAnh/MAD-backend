import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'Nguyen',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @Length(2, 50)
  @Expose({ name: 'first_name' })
  firstName: string;

  @ApiProperty({
    description: 'Họ của người dùng',
    example: 'Van A',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @Length(2, 50)
  @Expose({ name: 'last_name' })
  lastName: string;

  @ApiProperty({
    description: 'Tên đăng nhập, phải là duy nhất',
    example: 'nguyenvana',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @Length(3, 50)
  username: string;

  @ApiProperty({
    description: 'Địa chỉ email của người dùng, phải là duy nhất',
    example: 'nguyenvana@example.com',
    minLength: 5,
    maxLength: 100,
  })
  @IsEmail()
  @Length(5, 100)
  email: string;

  @ApiProperty({
    description: 'Mật khẩu (phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số)',
    example: 'Password123',
    minLength: 8,
    maxLength: 255,
  })
  @IsString()
  @Length(8, 255)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/, {
    message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
  })
  password: string;

  @ApiProperty({
    description: 'Vai trò của người dùng',
    enum: UserRole,
    default: 'user',
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Đánh dấu người dùng lần đầu đăng nhập',
    required: false,
    default: true,
  })
  @IsOptional()
  isFirstTime?: boolean;

  @ApiProperty({
    description: 'URL hình ảnh đại diện',
    required: false,
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  profile_image_url?: string;
}
