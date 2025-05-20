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
  @IsString()
  @Length(2, 50)
  @Expose({ name: 'first_name' })
  firstName: string;

  @IsString()
  @Length(2, 50)
  @Expose({ name: 'last_name' })
  lastName: string;

  @IsEmail()
  @Length(5, 100)
  email: string;

  @IsString()
  @Length(8, 255)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/, {
    message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
  })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  isFirstTime?: boolean;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}
