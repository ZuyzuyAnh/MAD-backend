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

  async uploadFileToPublicBucket(file: Express.Multer.File) {
    const bucketName = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET');
    const key = `${Date.now().toString()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        ContentLength: file.size,
      }),
    );

    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  }
}
