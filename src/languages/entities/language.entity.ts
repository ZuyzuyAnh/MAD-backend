import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Progress } from 'src/progress/entities/progress.entity';

@Entity('languages')
export class Language {
  @ApiProperty({ description: 'ID của ngôn ngữ', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Tên ngôn ngữ',
    example: 'Tiếng Anh',
  })
  @Column({ name: 'name', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Đường dẫn hình ảnh đại diện ngôn ngữ',
    example: 'https://example.com/flags/en.png',
  })
  @Column({ name: 'flag_url', nullable: true })
  flagUrl: string;

  @OneToMany(() => Progress, (progress) => progress.language)
  progress: Progress[];

  @ApiProperty({
    description: 'Thời gian tạo ngôn ngữ',
    example: '2023-08-01T12:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật ngôn ngữ gần nhất',
    example: '2023-08-01T12:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
