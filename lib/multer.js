import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import { upload } from '../common/constants';
import { artworkFileFilter, userFileFilter } from '../utils/upload';
const directory = fs.mkdtempSync(path.join(os.tmpdir(),'vesper-demo-'));
const storage = multer.diskStorage({
  destination: directory,
  filename: (req,file,cb) => cb(null, `${crypto.randomUUID()}.${file.mimetype === 'image/png' ? 'png' : 'jpg'}`),
});
let active = 0;
function boundedUpload(type,filter) {
  const parse = multer({storage,fileFilter:filter,limits:{fileSize:upload[type].fileSize,files:1,fields:20,fieldSize:16384,parts:21}}).single(`${type}Media`);
  return (req,res,next) => {
    if (active >= 1) return res.status(503).json({message:'Another image is being processed. Please try again shortly.',expose:true});
    active++;
    let released=false;
    const release=()=>{if (!released) {released=true;active--;}};
    res.once('finish',release);res.once('close',release);
    parse(req,res,error=>next(error));
  };
}
export default { uploadUserLocal: boundedUpload('user',userFileFilter), uploadArtworkLocal:boundedUpload('artwork',artworkFileFilter) };
