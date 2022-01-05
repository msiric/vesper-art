import * as Yup from "yup";
import { upload } from "../../../common/constants.js";

export const mediaValidation = Yup.object().shape({
  artworkMedia: Yup.mixed()
    .required("Artwork needs to have a file")
    .test(
      "fileType",
      `File needs to be in one of the following formats: ${upload.artwork.mimeTypes}`,
      (value) => value && upload.artwork.mimeTypes.includes(value.type)
    )
    .test(
      "fileSize",
      // 1048576 = 1024 * 1024
      `File needs to be less than ${upload.artwork.fileSize / 1048576}MB`,
      (value) => value && value.size <= upload.artwork.fileSize
    ),
});

export const updateArtwork = Yup.object().shape({
  artworkMedia: Yup.mixed()
    .test(
      "fileType",
      `File needs to be in one of the following formats: ${upload.artwork.mimeTypes}`,
      (value) =>
        !value || (value && upload.artwork.mimeTypes.includes(value.type))
    )
    .test(
      "fileSize",
      // 1048576 = 1024 * 1024
      `File needs to be less than ${upload.artwork.fileSize / 1048576}MB`,
      (value) => !value || (value && value.size <= upload.artwork.fileSize)
    ),
});

export const avatarValidation = Yup.object().shape({
  userMedia: Yup.mixed()
    .test(
      "fileType",
      `File needs to be in one of the following formats: ${Object.keys(
        upload.user.mimeTypes
      ).map((item) => upload.user.mimeTypes[item].label)}`,
      (value) =>
        !value ||
        (value && Object.keys(upload.user.mimeTypes).includes(value.type))
    )
    .test(
      "fileSize",
      `File needs to be less than ${upload.user.fileSize}MB`,
      (value) => !value || (value && value.size <= upload.user.fileSize)
    ),
});
