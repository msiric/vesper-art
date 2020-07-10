import * as Yup from "yup";

export const profileValidation = Yup.object().shape({
  // $TODO Validate file on client, validate string on server?
  userMedia: Yup.mixed()
    .test(
      "fileSize",
      `File needs to be less than ${userMediaConfig.size}MB`,
      (value) => value[0] && value[0].size <= userMediaConfig.size
    )
    .test(
      "fileType",
      `File needs to be in one of the following formats: ${userMediaConfig.format}`,
      (value) => value[0] && userMediaConfig.format.includes(value[0].type)
    ),
  userDescription: Yup.string().trim(),
  userCountry: Yup.string().trim(),
});
