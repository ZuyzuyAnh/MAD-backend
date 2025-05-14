import { Module } from '@nestjs/common';
import { PostReportsService } from './post_reports.service';
import { PostReportsController } from './post_reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostReport } from './entities/post-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostReport])],
  controllers: [PostReportsController],
  providers: [PostReportsService],
  exports: [PostReportsService],
})
export class PostReportsModule {}
