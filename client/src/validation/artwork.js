import * as Yup from "yup";
import { upload } from "../../../common/constants.js";

export const artworkValidation = Yup.object().shape({
  // $TODO Needs artworkDimensions, artworkMedia, artworkCover for server validation

  //   artworkMedia: Yup.mixed()
  //     .test(
  //       "fileSize",
  //       // 1048576 = 1024 * 1024
  //       `File needs to be less than ${upload.fileSize / 1048576}MB`,
  //       (value) => value[0] && value[0].size <= upload.fileSize
  //     )
  //     .test(
  //       "fileType",
  //       `File needs to be in one of the following formats: ${upload.mimeTypes}`,
  //       (value) => value[0] && upload.mimeTypes.includes(value[0].type)
  //     )
  //     .required("Artwork needs to have a file"),
  artworkTitle: Yup.string().trim().required("Artwork title is required"),
  artworkAvailability: Yup.string()
    .matches(/(available|unavailable)/)
    .required("Artwork availability is required"),
  artworkType: Yup.string()
    .notRequired()
    .when("artworkAvailability", {
      is: "available",
      then: Yup.string()
        .matches(/(commercial|free)/)
        .required("Artwork type is required"),
    }),
  artworkLicense: Yup.string()
    .notRequired()
    .when("artworkAvailability", {
      is: "available",
      then: Yup.string()
        .matches(/(commercial|personal)/)
        .required("Artwork license is required"),
    }),
  artworkPersonal: Yup.number()
    .notRequired()
    .when(["artworkAvailability", "artworkType"], {
      is: (artworkAvailability, artworkType) =>
        artworkAvailability === "available" && artworkType === "commercial",
      then: Yup.number()
        .positive("Artwork price cannot be negative")
        .integer()
        .min(10)
        .max(100000)
        .required("Artwork price is required"),
    }),
  artworkUse: Yup.string()
    .notRequired()
    .when(["artworkAvailability", "artworkLicense"], {
      is: (artworkAvailability, artworkLicense) =>
        artworkAvailability === "available" && artworkLicense === "commercial",
      then: Yup.string()
        .matches(/(separate|included)/)
        .required("Commercial use is required"),
    }),
  artworkCommercial: Yup.number()
    .notRequired()
    .when(["artworkAvailability", "artworkLicense", "artworkUse"], {
      is: (artworkAvailability, artworkLicense, artworkUse) =>
        artworkAvailability === "available" &&
        artworkLicense === "commercial" &&
        artworkUse === "separate",
      then: Yup.number()
        .positive("Commercial license cannot be negative")
        .integer()
        .min(5)
        .max(100000)
        .required("Commercial license is required"),
    }),
  artworkCategory: "",
  artworkDescription: Yup.string()
    .trim()
    .required("Artwork description is required"),
});
