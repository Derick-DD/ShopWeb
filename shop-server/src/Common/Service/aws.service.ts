// Other dependencies
import { S3 } from 'aws-sdk';
// Local files
import { configService } from './config.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AwsService {
  private s3Instance() {
    return new S3({
      accessKeyId: configService.getEnv('AWS_S3_ACCESS_KEY'),
      secretAccessKey: configService.getEnv('AWS_S3_SECRET_KEY'),
      region: configService.getEnv('AWS_S3_REGION'),
    });
  }
  private s3Url = configService.getEnv('AWS_S3_URL');

  getImageUrl(fileName: string, directory: 'users' | 'products'): string {
    this.s3Instance().getObject(
      {
        Bucket: configService.getEnv('AWS_S3_BUCKET'),
        Key: `${directory}/${fileName}`,
      },
      (error) => {
        if (error) {
          throw new NotFoundException('File not found');
        }
      },
    );
    const successUrl = `${this.s3Url}${directory}/${fileName}`;
    return successUrl;
  }

  uploadImage(
    fileName: string,
    directory: 'users' | 'products',
    file: Express.Multer.File,
  ): string {
    try {
      this.s3Instance().upload(
        {
          Bucket: configService.getEnv('AWS_S3_BUCKET'),
          Key: `${directory}/${fileName}`,
          Body: file.buffer,
        },
        () => {},
      );
    } catch (err) {
      return;
    }
    const successUrl = `${this.s3Url}${directory}/${fileName}`;
    return successUrl;
  }

  deleteImage(fileName: string, directory: 'users' | 'products'): void {
    this.s3Instance().deleteObject({
      Bucket: configService.getEnv('AWS_S3_BUCKET'),
      Key: `${directory}/${fileName}`,
    });
  }
}
