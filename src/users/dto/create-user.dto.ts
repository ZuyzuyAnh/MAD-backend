import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  first_name: string;

  @IsString()
  @Length(2, 50)
  last_name: string;

  @IsString()
  @Length(3, 50)
  username: string;

  @IsEmail()
  @Length(5, 100)
  email: string;

  @IsString()
  @Length(8, 255)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
  })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  profile_image_id?: number;

  @IsOptional()
  active?: boolean;
}
