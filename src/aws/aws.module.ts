import { Global, Module } from '@nestjs/common';
import { UploadFileService } from './uploadfile.s3.service';

@Global()
@Module({
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class AwsModule {}
