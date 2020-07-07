import path from "path";
import multer from "multer";
import jwt from "jsonwebtoken";
import { upload } from "../config/constants.js";
import { artworkFileFilter, userFileFilter } from "../utils/upload.js";

const multerApi = {
  uploadUserLocal: multer({
    fileFilter: userFileFilter,
    storage: multer.diskStorage({
      destination: "./uploads/",
      limits: { fileSize: upload.user.fileSize },
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
    storage: multer.diskStorage({
      destination: "./uploads/",
      limits: { fileSize: upload.artwork.fileSize },
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
