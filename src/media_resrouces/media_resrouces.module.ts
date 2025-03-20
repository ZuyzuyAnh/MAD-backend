import { Module } from '@nestjs/common';
import { MediaResroucesService } from './media_resrouces.service';
import { MediaResroucesController } from './media_resrouces.controller';
import { UploadFileService } from '../aws/uploadfile.s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaResource } from './entities/media_resrouce.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaResource])],
  controllers: [MediaResroucesController],
  providers: [MediaResroucesService, UploadFileService],
})
export class MediaResroucesModule {}
