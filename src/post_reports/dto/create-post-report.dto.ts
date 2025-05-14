import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ReportReason } from '../entities/post-report.entity';

export class CreatePostReportDto {
  @ApiProperty({
    description: 'ID của bài viết bị báo cáo',
    example: 5,
  })
  @IsInt()
  postId: number;

  @ApiProperty({
    description: 'Lý do báo cáo',
    enum: ReportReason,
    example: ReportReason.INAPPROPRIATE,
  })
  @IsEnum(ReportReason)
  reason: ReportReason;

  @ApiProperty({
    description: 'Mô tả chi tiết về báo cáo',
    example: 'Bài viết này có nội dung không phù hợp...',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
