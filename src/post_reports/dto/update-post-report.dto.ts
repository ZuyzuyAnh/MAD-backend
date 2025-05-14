import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreatePostReportDto } from './create-post-report.dto';

export class UpdatePostReportDto extends PartialType(CreatePostReportDto) {
  @ApiProperty({
    description: 'Trạng thái xử lý báo cáo',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isResolved?: boolean;
}
