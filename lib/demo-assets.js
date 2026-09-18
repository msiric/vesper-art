import crypto from 'node:crypto';
import createError from 'http-errors';
import catalog from '../common/demo/catalog.json';
import { DemoUpload } from '../entities/DemoUpload';
import { demoContext } from '../utils/demo-context';
const bundled = new Set([catalog.avatar.data.source, ...catalog.artwork.flatMap(a=>[a.version.media.data.source,a.version.cover.data.source])]);
export async function storeDemoAsset(content,mimeType) {
  const {userId,connection} = demoContext.getStore() || {};
  if (!userId || !connection) throw createError(403,'A temporary demo account is required');
  const [{bytes}] = await connection.query('SELECT COALESCE(SUM(bytes),0)::int AS bytes FROM demo_upload WHERE "ownerId" = $1',[userId]);
  if (bytes + content.length > 2 * 1024 * 1024) throw createError(413,'The 2 MB image storage allowance for this demo account is full.');
  const id=crypto.randomUUID();
  await connection.insert(DemoUpload,{id,ownerId:userId,content,mimeType,bytes:content.length});
  return `/api/demo/assets/${id}`;
}
export async function deleteDemoAsset(fileLink) {
  if (bundled.has(fileLink)) return;
  const match=/^\/api\/demo\/assets\/([\da-f-]{36})$/.exec(fileLink || '');
  const context=demoContext.getStore();
  if (!match || !context?.userId) throw createError(403,'Invalid demo asset');
  await context.connection.delete(DemoUpload,{id:match[1],ownerId:context.userId});
}
export function downloadDemoAsset(fileLink) {
  if (!bundled.has(fileLink) && !/^\/api\/demo\/assets\/[\da-f-]{36}$/.test(fileLink || '')) throw createError(404,'Demo asset not found');
  return {url:fileLink,file:`demo-${fileLink.split('/').pop()}`};
}
