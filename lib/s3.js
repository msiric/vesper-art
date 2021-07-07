import aws from "aws-sdk";
import { aws as awsConfig } from "../config/secret";

aws.config.update({
  secretAccessKey: awsConfig.secretAccessKey,
  accessKeyId: awsConfig.accessKeyId,
  region: awsConfig.region,
  signatureVersion: awsConfig.signatureVersion,
});

export const s3 = new aws.S3();

export const s3Params = ({ key, shouldExpire = false, ...rest }) => ({
  ...rest,
  Bucket: awsConfig.bucket,
  Key: key,
  ...(shouldExpire && { Expires: awsConfig.expires }),
});

export const uploadS3Object = async ({
  fileContent,
  fileName,
  folderName,
  mimeType,
}) => {
  const fullPath = `${folderName}/${fileName}`;
  const params = s3Params({
    key: fullPath,
    Body: fileContent,
    ACL: "public-read",
    ContentType: mimeType,
  });
  const uploadedFile = await s3.upload(params).promise();
  return uploadedFile.Location;
};

export const deleteS3Object = async ({ fileLink, folderName }) => {
  const fileName = fileLink.split("/").pop();
  const filePath = folderName + fileName;
  const params = s3Params({ key: filePath });
  await s3.deleteObject(params).promise();
};

export const getSignedS3Object = async ({ fileLink, folderName }) => {
  const fileName = fileLink.split("/").pop();
  const filePath = folderName + fileName;
  const params = s3Params({ key: filePath, shouldExpire: true });
  const url = s3.getSignedUrl("getObject", params);
  return { url, file: fileName };
};
