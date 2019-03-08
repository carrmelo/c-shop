import * as aws from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as multer from 'koa-multer';

// aws.config.update({
//   secretAccessKey: process.env.IAMAWSSecretKey,
//   accessKeyId: process.env.IAMAWSAccessKeyId,
//   region: process.env.IAMAWSRegion,
// });

export const bucket = new aws.S3(/*{ apiVersion: '2019-03-08' }*/)
  .createBucket({
    Bucket: process.env.IAMAWSBucket,
  })
  .promise();

// export const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: 'theam-cshop',
//     acl: 'public-read',
//     metadata(req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key(req, file, cb) {
//       cb(null, Date.now().toString());
//     },
//   }),
// });
