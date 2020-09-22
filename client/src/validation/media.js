import * as Yup from 'yup';
import { upload } from '../../../common/constants.js';

export const postArtworkValidation = Yup.object().shape({
  artworkMedia: Yup.mixed()
    .required('Artwork needs to have a file')
    .test(
      'fileSize',
      // 1048576 = 1024 * 1024
      `File needs to be less than ${upload.artwork.fileSize / 1048576}MB`,
      (value) => value && value.size <= upload.artwork.fileSize
    )
    .test(
      'fileType',
      `File needs to be in one of the following formats: ${upload.artwork.mimeTypes}`,
      (value) => value && upload.artwork.mimeTypes.includes(value.type)
    ),
});

export const patchArtworkValidation = Yup.object().shape({
  artworkMedia: Yup.mixed()
    .required('Artwork needs to have a file')
    .test(
      'fileSize',
      // 1048576 = 1024 * 1024
      `File needs to be less than ${upload.artwork.fileSize / 1048576}MB`,
      (value) => value && value.size <= upload.artwork.fileSize
    )
    .test(
      'fileType',
      `File needs to be in one of the following formats: ${upload.artwork.mimeTypes}`,
      (value) => value && upload.artwork.mimeTypes.includes(value.type)
    ),
});
