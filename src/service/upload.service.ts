import * as aws from 'aws-sdk';
import * as fs from 'fs';

export const uploadFile = async ({ fileName, filePath, fileType }) => {
  return new Promise((resolve, reject) => {
    aws.config.update({
      secretAccessKey: process.env.IAMAWSSecretKey,
      accessKeyId: process.env.IAMAWSAccessKeyId,
      region: process.env.IAMAWSRegion,
    });

    const s3 = new aws.S3({
      apiVersion: '2006-03-01',
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', err => reject(err));

    s3.upload(
      {
        ACL: 'public-read',
        Bucket: process.env.IAMAWSBucket,
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
