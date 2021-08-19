import * as Yup from "yup";
import { pricing } from "../../../common/constants";

export const artworkValidation = Yup.object().shape({
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
        .positive("Personal license cannot be negative")
        .integer()
        .min(pricing.minimumPrice)
        .max(pricing.maximumPrice)
        .required("Personal license is required"),
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
        .min(pricing.minimumPrice)
        .max(pricing.maximumPrice)
        .required("Commercial license is required"),
    }),
  artworkCategory: "",
  artworkDescription: Yup.string()
    .trim()
    .required("Artwork description is required"),
  artworkTags: Yup.array()
    .of(Yup.string())
    .min(1, "At least one tag is required")
    .max(5, "At most five tags are permitted")
    .required("Artwork tags are required"),
});
