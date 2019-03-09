import * as aws from 'aws-sdk';
import * as fs from 'fs';

interface FileStructure {
  fileName: string;
  filePath: string;
  fileType: string;
}

interface FileResolved {
  key: string;
  url: string;
}

// const creds = new aws.Credentials({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const myConfig = new aws.Config({
//   credentials: creds,
//   region: process.env.AWS_REGION,
// });

export const uploadFile = async ({
  fileName,
  filePath,
  fileType,
}: FileStructure): Promise<FileResolved> => {
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3({
      // region: process.env.AWS_REGION,
      apiVersion: '2006-03-01',
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', err => reject(err));

    s3.upload(
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
