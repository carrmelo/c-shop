import * as S3 from 'aws-sdk/clients/s3';
import { Observable, of } from 'rxjs';

class FileUpload {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
  result: any[];
}

export default class S3Controller {
  // FOLDER = '/* s3-folder-name */';
  BUCKET = process.env.IAMAWSBucket;

  private static getS3Bucket(): any {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.IAMAWSRegion,
    });
  }

  public uploadFile(file: any) {
    const bucket = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.IAMAWSRegion,
    });

    const params = {
      Bucket: this.BUCKET,
      Key: file.name,
      Body: file,
      ACL: 'public-read',
    };

    bucket.upload(params, (err: any, data: any) => {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
  }

  public getFiles(): Observable<Array<FileUpload>> {
    const fileUploads: any = [];

    const params = {
      Bucket: this.BUCKET,
      // Prefix: this.FOLDER,
    };

    S3Controller.getS3Bucket().listObjects(params, (err: any, data: any) => {
      if (err) {
        console.log(`There was an error getting your files: ${err}`);
        return;
      }
      console.log(`Successfully get files. ${data}`);

      const fileDetails = data.Contents;

      fileDetails.forEach((file: any) => {
        fileUploads.push(
          new FileUpload(
            file.Key,
            `https://s3.amazonaws.com/${params.Bucket}/${file.Key}`,
          ),
        );
      });
    });

    return of(fileUploads);
  }

  public deleteFile(file: FileUpload) {
    const params = {
      Bucket: this.BUCKET,
      Key: file.name,
    };

    S3Controller.getS3Bucket().deleteObject(params, (err: any, data: any) => {
      if (err) {
        console.log(`There was an error deleting your file: ${err.message}`);
        return;
      }
      console.log('Successfully deleted file.');
    });
  }
}
