import { Module } from '@nestjs/common';
import { MediaResroucesService } from './media_resrouces.service';
import { MediaResroucesController } from './media_resrouces.controller';
import { UploadFileService } from '../aws/uploadfile.s3.service';

@Module({
  imports: [UploadFileService],
  controllers: [MediaResroucesController],
  providers: [MediaResroucesService],
})
export class MediaResroucesModule {}
