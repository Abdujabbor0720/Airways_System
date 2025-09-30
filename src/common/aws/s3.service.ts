import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly publicBaseUrl?: string;

  constructor(private readonly cfg: ConfigService) {
    this.region = cfg.get<string>('AWS_REGION') || 'us-east-1';
    this.bucket = cfg.get<string>('AWS_S3_BUCKET') || '';
    this.publicBaseUrl = cfg.get<string>('AWS_S3_PUBLIC_BASE_URL') || undefined;

    this.client = new S3Client({
      region: this.region,
      credentials: cfg.get('AWS_ACCESS_KEY_ID') && cfg.get('AWS_SECRET_ACCESS_KEY')
        ? {
            accessKeyId: String(cfg.get('AWS_ACCESS_KEY_ID')),
            secretAccessKey: String(cfg.get('AWS_SECRET_ACCESS_KEY')),
          }
        : undefined,
    });
  }

  async uploadPublic(params: {
    buffer: Buffer;
    contentType?: string;
    prefix?: string;
    filename?: string;
  }): Promise<{ key: string; url: string }>
  {
    const { buffer, contentType, prefix = 'uploads', filename } = params;
    const ext = this.inferExt(filename, contentType);
    const key = `${prefix}/${randomUUID()}${ext}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    const url = this.publicBaseUrl
      ? this.joinUrl(this.publicBaseUrl, key)
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    return { key, url };
  }

  async deleteObject(key: string): Promise<void> {
    if (!key) return;
    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key })
      );
    } catch {
    }
  }

  private inferExt(filename?: string, contentType?: string): string {
    const fromName = filename && filename.includes('.') ? `.${filename.split('.').pop()}` : '';
    if (fromName) return fromName.toLowerCase();
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'application/pdf': '.pdf',
    };
    return (contentType && map[contentType]) || '';
  }

  private joinUrl(base: string, key: string): string {
    return `${base.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
  }
}
