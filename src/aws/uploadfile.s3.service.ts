import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';

@Injectable()
export class UploadFileService {
  private s3Client: S3Client;
  private bucketRegion: string;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketRegion =
      this.configService.get<string>('AWS_S3_REGION') || 'ap-southeast-1';
    this.bucketName =
      this.configService.get<string>('AWS_S3_PUBLIC_BUCKET') || '';

    this.s3Client = new S3Client({
      region: this.bucketRegion,
      endpoint: `https://s3.${this.bucketRegion}.amazonaws.com`,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_S3_ACCESSKEY') || '',
        secretAccessKey:
          this.configService.get<string>('AWS_S3_SECRETKEY') || '',
      },
    });
  }

  async uploadFileToPublicBucket(file: Express.Multer.File) {
    const key = `${Date.now().toString()}-${file.originalname}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        ContentLength: file.size,
      }),
    );

    console.log(this.bucketName);
    console.log(this.bucketRegion);

    return `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${key}`;
  }
}
