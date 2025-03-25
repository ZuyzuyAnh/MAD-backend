import { Progress } from 'src/progress/entities/progress.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  TEACHER = 'teacher',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID của người dùng', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Tên của người dùng', example: 'Nguyễn' })
  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @ApiProperty({ description: 'Họ của người dùng', example: 'Văn A' })
  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @ApiProperty({ description: 'Tên đăng nhập', example: 'nguyenvana' })
  @Column({ name: 'username', length: 50, unique: true })
  username: string;

  @ApiProperty({ description: 'Email', example: 'nguyenvana@example.com' })
  @Column({ name: 'email', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', length: 255 })
  password: string;

  @ApiProperty({
    description: 'Vai trò người dùng',
    enum: UserRole,
    example: UserRole.USER,
  })
  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    enumName: 'users_role',
  })
  role: UserRole;

  @ApiProperty({
    description: 'URL hình ảnh đại diện',
    example: 'https://example.com/avatars/user1.jpg',
  })
  @Column({
    name: 'profile_image_url',
    nullable: true,
  })
  profileImageUrl: string;

  @ApiProperty({ description: 'Tiến độ học tập của người dùng' })
  @OneToMany(() => Progress, (progress) => progress.user)
  progress: Progress[];

  @ApiProperty({
    description: 'Thời gian tạo tài khoản',
    example: '2023-08-01T12:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật gần nhất',
    example: '2023-08-01T12:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
