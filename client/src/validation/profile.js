import * as Yup from 'yup';

export const profileValidation = Yup.object().shape({
  // $TODO Validate file on client, validate string on server?
  /*   userMedia: Yup.mixed()
    .test(
      "fileSize",
      `File needs to be less than ${upload.user.fileSize}MB`,
      (value) => value[0] && value[0].size <= upload.user.fileSize
    )
    .test(
      "fileType",
      `File needs to be in one of the following formats: ${upload.user.mimeTypes}`,
      (value) => value[0] && upload.user.mimeTypes.includes(value[0].type)
    ), */
  userDescription: Yup.string().trim(),
  userCountry: Yup.string().trim(),
});
