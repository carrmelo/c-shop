import * as aws from 'aws-sdk';
import * as fs from 'fs';
import { File } from 'formidable';
import { FileResolved } from '../lib/interfaces';

interface FileStructure {
  fileName: string;
  filePath: string;
  fileType: string;
}

const s3Controller = (): any => {
  return new aws.S3({
    region: process.env.AWS_REGION,
    apiVersion: '2006-03-01',
  });
};

export const definePicture = async (picture: File) => {
  let uploadedPicture: FileResolved = { key: null, url: null };
  if (picture) {
    uploadedPicture = await uploadFile({
      fileName: picture.name,
      filePath: picture.path,
      fileType: picture.type,
    });
  }
  return uploadedPicture;
};

export const uploadFile = async ({
  fileName,
  filePath,
  fileType,
}: FileStructure): Promise<FileResolved> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    stream.on('error', err => reject(err));

    s3Controller().upload(
      {
        ACL: 'public-read',
        Bucket: process.env.AWS_BUCKET,
        Body: stream,
        Key: fileName,
        ContentType: fileType,
      },
      (err: any, data: any): any => {
        if (err) {
          reject(err);
        } else if (data) {
          resolve({ key: data.Key, url: data.Location });
        }
      },
    );
  });
};

export const deleteFile = async (key: string) => {
  s3Controller().deleteObject(
    { Bucket: process.env.AWS_BUCKET, Key: key },
    (err: any, data: any) => {
      if (err) {
        console.log(`There was an error deleting your file: ${err.message}`);
        return;
      }
      console.log('Successfully deleted file.');
    },
  );
};
