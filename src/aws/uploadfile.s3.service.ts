import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';

@Injectable()
export class UploadFileService {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESSKEY') || '',
        secretAccessKey:
          this.configService.get<string>('AWS_S3_SECRETKEY') || '',
      },
    });
  }

  async uploadFileToPublicBucket(
    path: string,
    { file, fileName }: { file: Express.Multer.File; fileName: string },
  ) {
    const bucketName = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET');
    const key = `${path}/${Date.now().toString()}-${fileName}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer as Buffer,
        ContentType: file.mimetype as string,
        ACL: 'public-read',
        ContentLength: file.size as number,
      }),
    );

    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  }
}
