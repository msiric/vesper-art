import { storeDemoAsset, deleteDemoAsset, downloadDemoAsset } from './demo-assets';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { aws as awsConfig } from '../config/secret';
let client;
const getClient = () => {
  if (process.env.DEMO_MODE === 'true') throw new Error('External S3 access is disabled in the demo');
  if (!client) client = new S3Client({ region: awsConfig.region, credentials: { accessKeyId: awsConfig.accessKeyId, secretAccessKey: awsConfig.secretAccessKey } });
  return client;
};
export const s3Params = ({ key, ...rest }) => ({ ...rest, Bucket: awsConfig.bucket, Key: key });
export const uploadS3Object = async ({ fileContent, fileName, folderName, mimeType }) => {
  if (process.env.DEMO_MODE === 'true') return storeDemoAsset(fileContent, mimeType);
  const key = `${folderName.replace(/\/$/,'')}/${fileName}`;
  await getClient().send(new PutObjectCommand(s3Params({ key, Body: fileContent, ContentType: mimeType })));
  // Originals remain private. Consumers must use the signed-download path.
  return `https://${awsConfig.bucket}.s3.${awsConfig.region}.amazonaws.com/${key}`;
};
export const deleteS3Object = async ({ fileLink, folderName }) => {
  if (process.env.DEMO_MODE === "true") return deleteDemoAsset(fileLink);
  const fileName = new URL(fileLink).pathname.split('/').pop();
  await getClient().send(new DeleteObjectCommand(s3Params({ key: `${folderName.replace(/\/$/,'')}/${fileName}` })));
};
export const getSignedS3Object = async ({ fileLink, folderName }) => {
  if (process.env.DEMO_MODE === "true") return downloadDemoAsset(fileLink);
  const fileName = new URL(fileLink).pathname.split('/').pop();
  const url = await getSignedUrl(getClient(), new GetObjectCommand(s3Params({key:`${folderName.replace(/\/$/,'')}/${fileName}`})), {expiresIn:180});
  return { url, file: fileName };
};
