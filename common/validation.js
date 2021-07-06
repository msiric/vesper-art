import * as Yup from "yup";
import { pricing, statusCodes, upload } from "./constants";

export const errors = {
  artworkTitleRequired: {
    status: statusCodes.internalError,
    message: "Artwork title is required",
    expose: true,
  },
  artworkAvailabilityRequired: {
    status: statusCodes.internalError,
    message: "Artwork availability is required",
    expose: true,
  },
  artworkAvailabilityInvalid: {
    status: statusCodes.internalError,
    message: "Artwork availability is invalid",
    expose: true,
  },
  artworkTypeRequired: {
    status: statusCodes.internalError,
    message: "Artwork type is required",
    expose: true,
  },
  artworkTypeInvalid: {
    status: statusCodes.internalError,
    message: "Artwork type is invalid",
    expose: true,
  },
  artworkLicenseRequired: {
    status: statusCodes.internalError,
    message: "Artwork license is required",
    expose: true,
  },
  artworkLicenseInvalid: {
    status: statusCodes.internalError,
    message: "Artwork license is invalid",
    expose: true,
  },
  artworkPersonalRequired: {
    status: statusCodes.internalError,
    message: "Artwork price is required",
    expose: true,
  },
  artworkPersonalNegative: {
    status: statusCodes.internalError,
    message: "Artwork price cannot be negative",
    expose: true,
  },
  artworkPersonalMin: {
    status: statusCodes.internalError,
    message: `Artwork price cannot be less than $${pricing.minimumPrice}`,
    expose: true,
  },
  artworkPersonalMax: {
    status: statusCodes.internalError,
    message: `Artwork price cannot be greater than $${pricing.maximumPrice}`,
    expose: true,
  },
  artworkUseRequired: {
    status: statusCodes.internalError,
    message: "Artwork use is required",
    expose: true,
  },
  artworkUseInvalid: {
    status: statusCodes.internalError,
    message: "Artwork use is invalid",
    expose: true,
  },
  artworkCommercialRequired: {
    status: statusCodes.internalError,
    message: "Commercial license is required",
    expose: true,
  },
  artworkCommercialNegative: {
    status: statusCodes.internalError,
    message: "Commercial license cannot be negative",
    expose: true,
  },
  artworkCommercialMin: {
    status: statusCodes.internalError,
    message:
      "Commercial license cannot be less than the cost of the personal license",
    expose: true,
  },
  artworkCommercialMax: {
    status: statusCodes.internalError,
    message: `Commercial license cannot be greater than ${pricing.maximumPrice}`,
    expose: true,
  },
  artworkVisibilityRequired: {
    status: statusCodes.internalError,
    message: "Artwork visibility is required",
    expose: true,
  },
  artworkVisibilityInvalid: {
    status: statusCodes.internalError,
    message: "Artwork visibility is invalid",
    expose: true,
  },
  artworkDescriptionRequired: {
    status: statusCodes.internalError,
    message: "Artwork description is required",
    expose: true,
  },
  billingNameRequired: {
    status: statusCodes.internalError,
    message: "First name is required",
    expose: true,
  },
  billingSurnameRequired: {
    status: statusCodes.internalError,
    message: "Last name is required",
    expose: true,
  },
  billingAddressRequired: {
    status: statusCodes.internalError,
    message: "Address is required",
    expose: true,
  },
  billingZipRequired: {
    status: statusCodes.internalError,
    message: "Postal code is required",
    expose: true,
  },
  billingCityRequired: {
    status: statusCodes.internalError,
    message: "City is required",
    expose: true,
  },
  billingCountryRequired: {
    status: statusCodes.internalError,
    message: "Country is required",
    expose: true,
  },
  commentContentRequired: {
    status: statusCodes.internalError,
    message: "Comment cannot be empty",
    expose: true,
  },
  discountCodeRequired: {
    status: statusCodes.internalError,
    message: "Discount cannot be empty",
    expose: true,
  },
  licenseAssigneeRequired: {
    status: statusCodes.internalError,
    message: "License assignee is required",
    expose: true,
  },
  licenseTypeRequired: {
    status: statusCodes.internalError,
    message: "License type is required",
    expose: true,
  },
  licenseTypeInvalid: {
    status: statusCodes.internalError,
    message: "License type is invalid",
    expose: true,
  },
  userUsernameRequired: {
    status: statusCodes.internalError,
    message: "Username is required",
    expose: true,
  },
  userUsernameMin: {
    status: statusCodes.internalError,
    message: "Username must contain at least 5 characters",
    expose: true,
  },
  userUsernameMax: {
    status: statusCodes.internalError,
    message: "Username cannot contain more than 20 characters",
    expose: true,
  },
  userPasswordRequired: {
    status: statusCodes.internalError,
    message: "Enter your password",
    expose: true,
  },
  userPasswordMin: {
    status: statusCodes.internalError,
    message: "Password must contain at least 8 characters",
    expose: true,
  },
  artworkMediaRequired: {
    status: statusCodes.internalError,
    message: "Artwork needs to have a file",
    expose: true,
  },
  artworkMediaType: {
    status: statusCodes.internalError,
    message: `File needs to be in one of the following formats: ${upload.artwork.mimeTypes}`,
    expose: true,
  },
  artworkMediaSize: {
    status: statusCodes.internalError,
    message: `File needs to be less than ${
      upload.artwork.fileSize / 1048576
    }MB`,
    expose: true,
  },
  userMediaType: {
    status: statusCodes.internalError,
    message: `File needs to be in one of the following formats: ${upload.user.mimeTypes}`,
    expose: true,
  },
  userMediaSize: {
    status: statusCodes.internalError,
    message: `File needs to be less than ${upload.user.fileSize / 1048576}MB`,
    expose: true,
  },
  orderIntentInvalid: {
    status: statusCodes.internalError,
    message: "Invalid intent",
    expose: true,
  },
  originCountryRequired: {
    status: statusCodes.internalError,
    message: "Country cannot be empty",
    expose: true,
  },
  userNewRequired: {
    status: statusCodes.internalError,
    message: "Enter new password",
    expose: true,
  },
  userConfirmationRequired: {
    status: statusCodes.internalError,
    message: "Confirm your password",
    expose: true,
  },
  userPasswordMismatch: {
    status: statusCodes.internalError,
    message: "Passwords do not match",
    expose: true,
  },
  favoritesPreferenceRequired: {
    status: statusCodes.internalError,
    message: "Favorites need to have a value",
    expose: true,
  },
  userDescriptionMax: {
    status: statusCodes.internalError,
    message: "Description cannot contain more than 250 characters",
    expose: true,
  },
  reviewRatingRequired: {
    status: statusCodes.internalError,
    message: "Rating cannot be empty",
    expose: true,
  },
  reviewRatingMin: {
    status: statusCodes.internalError,
    message: "Rating cannot be less than 1",
    expose: true,
  },
  reviewRatingMax: {
    status: statusCodes.internalError,
    message: "Rating cannot be greater than 5",
    expose: true,
  },
  searchTypeRequired: {
    status: statusCodes.internalError,
    message: "Search type is required",
    expose: true,
  },
  searchTypeInvalid: {
    status: statusCodes.internalError,
    message: "Search type is invalid",
    expose: true,
  },
  userUsernameInvalid: {
    status: statusCodes.internalError,
    message:
      "Username can only contain letters, numbers, underscores and periods",
    expose: true,
  },
  userUsernameMin: {
    status: statusCodes.internalError,
    message: "Username must contain at least 5 characters",
    expose: true,
  },
  userUsernameMax: {
    status: statusCodes.internalError,
    message: "Username cannot contain more than 20 characters",
    expose: true,
  },
  licenseFingerprintRequired: {
    status: statusCodes.internalError,
    message: "Fingerprint cannot be empty",
    expose: true,
  },
  userEmailRequired: {
    status: statusCodes.internalError,
    message: "Email is required",
    expose: true,
  },
  userEmailInvalid: {
    status: statusCodes.internalError,
    message: "Invalid email",
    expose: true,
  },
  requiredValue: {
    status: statusCodes.internalError,
    message: "Required value",
    expose: true,
  },
  invalidUUID: {
    status: statusCodes.internalError,
    message: "Invalid UUID",
    expose: true,
  },
  invalidValue: {
    status: statusCodes.internalError,
    message: "Invalid value",
    expose: true,
  },
};

export const artworkValidation = Yup.object().shape({
  artworkTitle: Yup.string().trim().required(errors.artworkTitleRequired),
  artworkAvailability: Yup.string()
    .matches(/(available|unavailable)/, errors.artworkAvailabilityInvalid)
    .required(errors.artworkAvailabilityRequired),
  artworkType: Yup.string()
    .notRequired()
    .when("artworkAvailability", {
      is: "available",
      then: Yup.string()
        .matches(/(commercial|free)/, errors.artworkTypeInvalid)
        .required(errors.artworkTypeRequired),
      otherwise: Yup.string().matches(
        /(unavailable)/,
        errors.artworkTypeInvalid
      ),
    }),
  artworkLicense: Yup.string()
    .notRequired()
    .when("artworkAvailability", {
      is: "available",
      then: Yup.string()
        .matches(/(commercial|personal)/, errors.artworkLicenseInvalid)
        .required(errors.artworkLicenseRequired),
      otherwise: Yup.string().matches(
        /(unavailable)/,
        errors.artworkLicenseInvalid
      ),
    }),
  artworkPersonal: Yup.number()
    .notRequired()
    .when(["artworkAvailability", "artworkType"], {
      is: (artworkAvailability, artworkType) =>
        artworkAvailability === "available" && artworkType === "commercial",
      then: Yup.number()
        .positive(errors.artworkPersonalNegative)
        .integer()
        .min(pricing.minimumPrice, errors.artworkPersonalMin)
        .max(pricing.maximumPrice, errors.artworkPersonalMax)
        .required(errors.artworkPersonalRequired),
      otherwise: Yup.number().integer().min(0).max(0),
    }),
  artworkUse: Yup.string()
    .notRequired()
    .when(["artworkAvailability", "artworkLicense"], {
      is: (artworkAvailability, artworkLicense) =>
        artworkAvailability === "available" && artworkLicense === "commercial",
      then: Yup.string()
        .matches(/(separate|included)/, errors.artworkUseInvalid)
        .required(errors.artworkUseRequired),
      otherwise: Yup.string().matches(
        /(unavailable)/,
        errors.artworkUseInvalid
      ),
    }),
  artworkCommercial: Yup.number()
    .notRequired()
    .when(["artworkAvailability", "artworkLicense", "artworkUse"], {
      is: (artworkAvailability, artworkLicense, artworkUse) =>
        artworkAvailability === "available" &&
        artworkLicense === "commercial" &&
        artworkUse === "separate",
      then: Yup.number()
        .positive(errors.artworkCommercialNegative)
        .integer()
        .moreThan(Yup.ref("artworkPersonal"), errors.artworkCommercialMin)
        .max(pricing.maximumPrice, errors.artworkCommercialMax)
        .required(errors.artworkCommercialRequired),
      otherwise: Yup.number().integer().min(0).max(0),
    }),
  // artworkCategory: "",
  // artworkTags: Yup.array()
  //   .of(Yup.string())
  //   .min(1, "At least one tag is required")
  //   .max(5, "At most five tags are permitted")
  //   .required("Artwork tags are required"),
  artworkVisibility: Yup.string()
    .matches(/(visible|invisible)/, errors.artworkVisibilityInvalid)
    .required(errors.artworkVisibilityRequired),
  artworkDescription: Yup.string()
    .trim()
    .required(errors.artworkDescriptionRequired),
});

export const billingValidation = Yup.object().shape({
  billingName: Yup.string().trim().required(errors.billingNameRequired),
  billingSurname: Yup.string().trim().required(errors.billingSurnameRequired),
  billingEmail: Yup.string()
    .email(errors.userEmailInvalid)
    .required(errors.userEmailRequired),
  billingAddress: Yup.string().trim().required(errors.billingAddressRequired),
  billingZip: Yup.string().trim().required(errors.billingZipRequired),
  billingCity: Yup.string().trim().required(errors.billingCityRequired),
  billingCountry: Yup.string().trim().required(errors.billingCountryRequired),
});

export const commentValidation = Yup.object().shape({
  commentContent: Yup.string().trim().required(errors.commentContentRequired),
});

export const discountValidation = Yup.object().shape({
  discountCode: Yup.string().trim().required(errors.discountCodeRequired),
});

export const emailValidation = Yup.object().shape({
  userEmail: Yup.string()
    .email(errors.userEmailInvalid)
    .trim()
    .required(errors.userEmailRequired),
});

export const licenseValidation = Yup.object().shape({
  // $TODO Needs licenseOwner, licenseArtwork, licensePrice for server validation
  licenseAssignee: Yup.string().required(errors.licenseAssigneeRequired),
  licenseCompany: Yup.string(),
  licenseType: Yup.string()
    .matches(/(personal|commercial)/, errors.licenseTypeInvalid)
    .required(errors.licenseTypeRequired),
});

export const loginValidation = Yup.object().shape({
  userUsername: Yup.string()
    .trim()
    .min(5, errors.userUsernameMin)
    .max(20, errors.userUsernameMax)
    .lowercase()
    .required(errors.userUsernameRequired),
  userPassword: Yup.string()
    .trim()
    .min(8, errors.userPasswordMin)
    .required(errors.userPasswordRequired),
});

export const addArtwork = Yup.object().shape({
  artworkMedia: Yup.mixed()
    .required(errors.artworkMediaRequired)
    .test(
      "fileType",
      errors.artworkMediaType,
      (value) => value && upload.artwork.mimeTypes.includes(value.type)
    )
    .test(
      "fileSize",
      // 1048576 = 1024 * 1024
      errors.artworkMediaSize,
      (value) => value && value.size <= upload.artwork.fileSize
    ),
});

/* export const updateArtwork = Yup.object().shape({
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
}); */

export const patchAvatar = Yup.object().shape({
  userMedia: Yup.mixed()
    .test(
      "fileType",
      errors.userMediaType,
      (value) => !value || (value && upload.user.mimeTypes.includes(value.type))
    )
    .test(
      "fileSize",
      errors.userMediaSize,
      (value) => !value || (value && value.size <= upload.user.fileSize)
    ),
});

export const orderValidation = Yup.object().shape({
  orderBuyer: Yup.string()
    .uuid(errors.invalidUUID)
    .required(errors.requiredValue),
  orderSeller: Yup.string()
    .uuid(errors.invalidUUID)
    .required(errors.requiredValue),
  orderArtwork: Yup.string()
    .uuid(errors.invalidUUID)
    .required(errors.requiredValue),
  orderVersion: Yup.string()
    .uuid(errors.invalidUUID)
    .required(errors.requiredValue),
  orderDiscount: Yup.string()
    .uuid(errors.invalidUUID)
    .nullable(errors.requiredValue),
  orderLicense: Yup.string()
    .uuid(errors.invalidUUID)
    .required(errors.requiredValue),
  orderSpent: Yup.number().integer().required(errors.requiredValue),
  orderEarned: Yup.number().integer().required(errors.requiredValue),
  orderFee: Yup.number().integer().required(errors.requiredValue),
  orderIntent: Yup.string(errors.orderIntentInvalid).required(
    errors.requiredValue
  ),
});

export const downloadValidation = Yup.object().shape({
  orderBuyer: Yup.string()
    .uuid(errors.invalidUUID)
    .required(errors.requiredValue),
  orderSeller: Yup.string()
    .uuid(errors.invalidUUID)
    .required(errors.requiredValue),
  orderArtwork: Yup.string()
    .uuid(errors.invalidUUID)
    .required(errors.requiredValue),
  orderVersion: Yup.string()
    .uuid(errors.invalidUUID)
    .required(errors.requiredValue),
  orderDiscount: Yup.string()
    .uuid(errors.invalidUUID)
    .nullable(errors.requiredValue),
  orderLicense: Yup.string()
    .uuid(errors.invalidUUID)
    .required(errors.requiredValue),
  orderSpent: Yup.number().integer().required(errors.requiredValue),
  orderEarned: Yup.number().integer().required(errors.requiredValue),
  orderFee: Yup.number().integer().required(errors.requiredValue),
});

export const originValidation = Yup.object().shape({
  userBusinessAddress: Yup.string()
    .trim()
    .required(errors.originCountryRequired),
});

export const passwordValidation = Yup.object().shape({
  userCurrent: Yup.string().required(errors.userPasswordRequired),
  userPassword: Yup.string()
    .min(8, errors.userPasswordMin)
    .required(errors.userNewRequired),
  userConfirm: Yup.string()
    .required(errors.userConfirmationRequired)
    .oneOf([Yup.ref("userPassword")], errors.userPasswordMismatch),
});

export const preferencesValidation = Yup.object().shape({
  userFavorites: Yup.boolean().required(errors.favoritesPreferenceRequired),
});

export const profileValidation = Yup.object().shape({
  userDescription: Yup.string().trim().max(250, errors.userDescriptionMax),
  userCountry: Yup.string().trim(),
});

export const resetValidation = Yup.object().shape({
  // $TODO Add proper password validation
  userPassword: Yup.string()
    .min(8, errors.userPasswordMin)
    .required(errors.userPasswordRequired),
  userConfirm: Yup.string()
    .required(errors.userConfirmationRequired)
    .oneOf([Yup.ref("userPassword"), null], errors.userPasswordMismatch),
});

export const reviewValidation = Yup.object().shape({
  reviewRating: Yup.number()
    .min(1, errors.reviewRatingMin)
    .max(5, errors.reviewRatingMax)
    .required(errors.reviewRatingRequired),
});

export const searchValidation = Yup.object().shape({
  searchQuery: Yup.string(),
  searchType: Yup.string()
    .matches(/(artwork|users)/, errors.searchTypeInvalid)
    .required(errors.searchTypeRequired),
});

export const signupValidation = Yup.object().shape({
  userUsername: Yup.string()
    .trim()
    .matches(/^([\w.]){0,}$/, errors.userUsernameInvalid)
    .min(5, errors.userUsernameMin)
    .max(20, errors.userUsernameMax)
    .lowercase()
    .required(errors.userUsernameRequired),
  userEmail: Yup.string()
    .email(errors.userEmailInvalid)
    .required(errors.userEmailRequired),
  userPassword: Yup.string()
    .min(8, errors.userPasswordMin)
    .required(errors.userPasswordRequired),
  userConfirm: Yup.string()
    .required(errors.userConfirmationRequired)
    .oneOf([Yup.ref("userPassword")], errors.userPasswordMismatch),
});

export const ticketValidation = Yup.object().shape({
  ticketTitle: Yup.string().trim().required(),
  ticketBody: Yup.string().trim().required(),
});

export const fingerprintValidation = Yup.object().shape({
  licenseFingerprint: Yup.string()
    .trim()
    .required(errors.licenseFingerprintRequired),
});

export const recoveryValidation = Yup.object().shape({
  userUsername: Yup.string().required(errors.userUsernameRequired),
  userEmail: Yup.string()
    .email(errors.userEmailInvalid)
    .required(errors.userEmailRequired),
  userPassword: Yup.string()
    .min(8, errors.userPasswordMin)
    .required(errors.userPasswordRequired),
});

export const emptyValidation = Yup.object().shape({});
