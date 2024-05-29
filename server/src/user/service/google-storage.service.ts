import { Global, Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Global()
@Injectable()
export class GoogleStorageService {
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor() {
    //Initialization connection with Google Cloud Storage
    this.storage = new Storage();
    this.bucketName = 'user_photo_bucket';
  }

  async uploadPhoto(file: any): Promise<string> {
    //Upload photo to Google Cloud Storage
    const bucket = this.storage.bucket(this.bucketName);
    const fileName = `${Date.now()}-${file.originalFileName}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer);
    return `https://storage.googleapis.com/your-bucket-name/${fileName}`;
  }

  async editPhoto(fileName: string, newPhoto: any): Promise<any> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    await file.save(newPhoto);
  }

  async deletePhoto(fileName: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);

    await file.delete();
  }
}
