import * as Yup from "yup";
import { pricing, upload } from "./constants";

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
        .positive("Artwork price cannot be negative")
        .integer()
        .min(pricing.minimumPrice)
        .max(pricing.maximumPrice)
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

export const billingValidation = Yup.object().shape({
  billingName: Yup.string().trim().required("First name is required"),
  billingSurname: Yup.string().trim().required("Last name is required"),
  billingEmail: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  billingAddress: Yup.string().trim().required("Address is required"),
  billingZip: Yup.string().trim().required("Postal code is required"),
  billingCity: Yup.string().trim().required("City is required"),
  billingCountry: Yup.string().trim().required("Country is required"),
});

export const commentValidation = Yup.object().shape({
  commentContent: Yup.string().trim().required("Comment cannot be empty"),
});

export const countryValidation = Yup.object().shape({
  userCountry: Yup.string().trim().required("Country cannot be empty"),
});

export const discountValidation = Yup.object().shape({
  discountCode: Yup.string().trim().required("Discount cannot be empty"),
});

export const emailValidation = Yup.object().shape({
  userEmail: Yup.string()
    .email("Invalid email")
    .trim()
    .required("Email is required"),
});

export const licenseValidation = Yup.object().shape({
  // $TODO Needs licenseOwner, licenseArtwork, licensePrice for server validation
  licenseAssignee: Yup.string().required("License assignee is required"),
  licenseCompany: Yup.string(),
  licenseType: Yup.string()
    .matches(/(personal|commercial)/, "License type is invalid")
    .required("License type is required"),
});

export const loginValidation = Yup.object().shape({
  userUsername: Yup.string().trim().required("Username or email is required"),
  userPassword: Yup.string()
    .trim()
    .min(8, "Password must contain at least 8 characters")
    .required("Enter your password"),
});

export const addArtwork = Yup.object().shape({
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

export const patchAvatar = Yup.object().shape({
  userMedia: Yup.mixed()
    .test(
      "fileType",
      `File needs to be in one of the following formats: ${upload.user.mimeTypes}`,
      (value) => !value || (value && upload.user.mimeTypes.includes(value.type))
    )
    .test(
      "fileSize",
      `File needs to be less than ${upload.user.fileSize}MB`,
      (value) => !value || (value && value.size <= upload.user.fileSize)
    ),
});

export const orderValidation = Yup.object().shape({
  orderBuyer: Yup.string.uuid("Invalid UUID")().required(),
  orderSeller: Yup.string.uuid("Invalid UUID")().required(),
  orderArtwork: Yup.string.uuid("Invalid UUID")().required(),
  orderVersion: Yup.string.uuid("Invalid UUID")().required(),
  orderDiscount: Yup.string.uuid("Invalid UUID")().required(),
  orderLicense: Yup.string.uuid("Invalid UUID")().required(),
  orderSpent: Yup.number().integer().required(),
  orderEarned: Yup.number().integer().required(),
  orderFee: Yup.number().integer().required(),
  orderIntent: Yup.string.uuid("Invalid UUID")().required(),
});

export const originValidation = Yup.object().shape({
  userBusinessAddress: Yup.string().trim().required("Country cannot be empty"),
});

export const passwordValidation = Yup.object().shape({
  userCurrent: Yup.string().required("Enter your password"),
  userPassword: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .required("Enter new password"),
  userConfirm: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export const preferencesValidation = Yup.object().shape({
  userFavorites: Yup.boolean().required("Favorites need to have a value"),
});

export const profileValidation = Yup.object().shape({
  userDescription: Yup.string().trim(),
  userCountry: Yup.string().trim(),
});

export const rangeValidation = Yup.object().shape({
  rangeFrom: Yup.string().trim().required(),
  rangeTo: Yup.string().trim().required(),
});

export const resetValidation = Yup.object().shape({
  // $TODO Add proper password validation
  userPassword: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .required("Enter your password"),
  userConfirm: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const reviewValidation = Yup.object().shape({
  reviewRating: Yup.number().min(1).max(5).required("Rating cannot be empty"),
  reviewContent: Yup.string().trim().required("Revieww cannot be empty"),
});

export const searchValidation = Yup.object().shape({
  searchQuery: Yup.string().allow(""),
  searchType: Yup.string().valid("artwork", "users").required(),
});

export const signupValidation = Yup.object().shape({
  userUsername: Yup.string().required("Username is required"),
  userEmail: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  userPassword: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .required("Enter your password"),
  userConfirm: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("userPassword")], "Passwords do not match"),
});

export const ticketValidation = Yup.object().shape({
  ticketTitle: Yup.string().trim().required(),
  ticketBody: Yup.string().trim().required(),
});

export const fingerprintValidation = Yup.object().shape({
  licenseFingerprint: Yup.string().trim().required(),
});
