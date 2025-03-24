import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('languages')
export class Language {
  @ApiProperty({ description: 'ID của ngôn ngữ', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Tên ngôn ngữ',
    example: 'Tiếng Anh',
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Mã ISO của ngôn ngữ',
    example: 'en',
  })
  @Column({ length: 10, unique: true })
  code: string;

  @ApiProperty({
    description: 'Đường dẫn hình ảnh đại diện ngôn ngữ',
    example: 'https://example.com/flags/en.png',
  })
  @Column({ nullable: true })
  flag_url: string;

  @ApiProperty({
    description: 'Trạng thái hoạt động của ngôn ngữ',
    default: true,
  })
  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
