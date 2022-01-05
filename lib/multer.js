import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { upload } from "../common/constants";
import { artworkFileFilter, userFileFilter } from "../utils/upload";

const multerApi = {
  uploadUserLocal: multer({
    fileFilter: userFileFilter,
    limits: { fileSize: upload.user.fileSize },
    storage: multer.diskStorage({
      destination: "./uploads/",
      filename: function (req, file, cb) {
        const token = req.headers["authorization"].split(" ")[1];
        const data = jwt.decode(token);
        const fileName =
          data.id + Date.now().toString() + path.extname(file.originalname);
        cb(null, fileName);
      },
    }),
  }).single("userMedia"),
  uploadArtworkLocal: multer({
    fileFilter: artworkFileFilter,
    limits: { fileSize: upload.artwork.fileSize },
    storage: multer.diskStorage({
      destination: "./uploads/",
      filename: function (req, file, cb) {
        const token = req.headers["authorization"].split(" ")[1];
        const data = jwt.decode(token);
        const fileName =
          data.id + Date.now().toString() + path.extname(file.originalname);
        cb(null, fileName);
      },
    }),
  }).single("artworkMedia"),
};

export default multerApi;
