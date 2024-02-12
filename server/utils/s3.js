const aws = require("aws-sdk");

// aws configuration
aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: "us-east-2",
});

const s3 = new aws.S3();

const deleteObject = (key) => {
  return new Promise((resolve, reject) => {
    s3.deleteObject(
      {
        Bucket: process.env.S3BUCKETNAME,
        Key: key,
      },
      (err, data) => {
        if (err) {
          console.log("Error deleting object: ", err);
          reject(err);
        } else {
          console.log("Success deleting object: ", key, data);
          resolve(data);
        }
      }
    );
  });
};

const putObject = (mime, buffer, key) => {
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        ACL: "public-read", // https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html
        Bucket: process.env.S3BUCKETNAME,
        Key: key,
        Body: buffer,
        ContentType: mime,
      },
      (err, response) => {
        if (err) {
          console.log({ err });
          reject({ err });
        }
        resolve({ response });
      }
    );
  });
};

const getSignedUrl = (key) => {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl(
      "getObject",
      { Key: key, Bucket: process.env.S3BUCKETNAME },
      (err, url) => {
        if (err) reject(err);
        else resolve(url);
      }
    );
  });
};

const getObject = (key, bucket = null) => {
  return new Promise((resolve, reject) => {
    s3.getObject(
      { Key: key, Bucket: bucket || process.env.S3BUCKETNAME },
      (err, data) => {
        if (err) reject(err);
        else resolve(data);
      }
    );
  });
};

module.exports = { deleteObject, putObject, getObject, getSignedUrl };
