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
  invalidString: {
    status: statusCodes.internalError,
    message: "Value needs to be a string",
    expose: true,
  },
  invalidNumber: {
    status: statusCodes.internalError,
    message: "Value needs to be a positive integer",
    expose: true,
  },
};

export const artworkValidation = Yup.object().shape({
  artworkTitle: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.artworkTitleRequired.message),
  artworkAvailability: Yup.string()
    .typeError(errors.invalidString.message)
    .matches(
      /(available|unavailable)/,
      errors.artworkAvailabilityInvalid.message
    )
    .required(errors.artworkAvailabilityRequired.message),
  artworkType: Yup.string()
    .typeError(errors.invalidString.message)
    .notRequired()
    .when("artworkAvailability", {
      is: "available",
      then: Yup.string()
        .typeError(errors.invalidString.message)
        .matches(/(commercial|free)/, errors.artworkTypeInvalid.message)
        .required(errors.artworkTypeRequired.message),
      otherwise: Yup.string()
        .typeError(errors.invalidString.message)
        .matches(/(unavailable)/, errors.artworkTypeInvalid.message)
        .required(errors.artworkTypeRequired.message),
    }),
  artworkLicense: Yup.string()
    .typeError(errors.invalidString.message)
    .notRequired()
    .when("artworkAvailability", {
      is: "available",
      then: Yup.string()
        .typeError(errors.invalidString.message)
        .matches(/(commercial|personal)/, errors.artworkLicenseInvalid.message)
        .required(errors.artworkLicenseRequired.message),
      otherwise: Yup.string()
        .typeError(errors.invalidString.message)
        .matches(/(unavailable)/, errors.artworkLicenseInvalid.message)
        .required(errors.artworkLicenseRequired.message),
    }),
  artworkPersonal: Yup.number()
    .typeError(errors.invalidNumber.message)
    .notRequired()
    .when(["artworkAvailability", "artworkType"], {
      is: (artworkAvailability, artworkType) =>
        artworkAvailability === "available" && artworkType === "commercial",
      then: Yup.number()
        .integer()
        .positive(errors.artworkPersonalNegative.message)
        .min(pricing.minimumPrice, errors.artworkPersonalMin.message)
        .max(pricing.maximumPrice, errors.artworkPersonalMax.message)
        .typeError(errors.invalidNumber.message)
        .required(errors.artworkPersonalRequired.message),
      otherwise: Yup.number()
        .integer()
        .min(0)
        .max(0)
        .typeError(errors.invalidNumber.message)
        .required(errors.artworkPersonalRequired.message),
    }),
  artworkUse: Yup.string()
    .typeError(errors.invalidString.message)
    .notRequired()
    .when(["artworkAvailability", "artworkLicense"], {
      is: (artworkAvailability, artworkLicense) =>
        artworkAvailability === "available" && artworkLicense === "commercial",
      then: Yup.string()
        .typeError(errors.invalidString.message)
        .matches(/(separate|included)/, errors.artworkUseInvalid.message)
        .required(errors.artworkUseRequired.message),
      otherwise: Yup.string()
        .typeError(errors.invalidString.message)
        .matches(/(unavailable)/, errors.artworkUseInvalid.message)
        .required(errors.artworkUseRequired.message),
    }),
  artworkCommercial: Yup.number()
    .typeError(errors.invalidNumber.message)
    .notRequired()
    .when(["artworkAvailability", "artworkLicense", "artworkUse"], {
      is: (artworkAvailability, artworkLicense, artworkUse) =>
        artworkAvailability === "available" &&
        artworkLicense === "commercial" &&
        artworkUse === "separate",
      then: Yup.number()
        .integer()
        .positive(errors.artworkCommercialNegative.message)
        .moreThan(
          Yup.ref("artworkPersonal"),
          errors.artworkCommercialMin.message
        )
        .max(pricing.maximumPrice, errors.artworkCommercialMax.message)
        .typeError(errors.invalidNumber.message)
        .required(errors.artworkCommercialRequired.message),
      otherwise: Yup.number()
        .integer()
        .min(0)
        .max(0)
        .typeError(errors.invalidNumber.message)
        .required(errors.artworkCommercialRequired.message),
    }),
  // artworkCategory: "",
  // artworkTags: Yup.array()
  //   .of(Yup.string().typeError(errors.invalidString.message))
  //   .min(1, "At least one tag is required")
  //   .max(5, "At most five tags are permitted")
  //   .required("Artwork tags are required"),
  artworkVisibility: Yup.string()
    .typeError(errors.invalidString.message)
    .matches(/(visible|invisible)/, errors.artworkVisibilityInvalid.message)
    .required(errors.artworkVisibilityRequired.message),
  artworkDescription: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.artworkDescriptionRequired.message),
});

export const billingValidation = Yup.object().shape({
  billingName: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.billingNameRequired.message),
  billingSurname: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.billingSurnameRequired.message),
  billingEmail: Yup.string()
    .typeError(errors.invalidString.message)
    .email(errors.userEmailInvalid.message)
    .required(errors.userEmailRequired.message),
  billingAddress: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.billingAddressRequired.message),
  billingZip: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.billingZipRequired.message),
  billingCity: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.billingCityRequired.message),
  billingCountry: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.billingCountryRequired.message),
});

export const commentValidation = Yup.object().shape({
  commentContent: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.commentContentRequired.message),
});

export const discountValidation = Yup.object().shape({
  discountCode: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.discountCodeRequired.message),
});

export const emailValidation = Yup.object().shape({
  userEmail: Yup.string()
    .typeError(errors.invalidString.message)
    .email(errors.userEmailInvalid.message)
    .trim()
    .required(errors.userEmailRequired.message),
});

export const licenseValidation = Yup.object().shape({
  // $TODO Needs licenseOwner, licenseArtwork, licensePrice for server validation
  licenseAssignee: Yup.string()
    .typeError(errors.invalidString.message)
    .required(errors.licenseAssigneeRequired.message),
  licenseCompany: Yup.string().typeError(errors.invalidString.message),
  licenseType: Yup.string()
    .typeError(errors.invalidString.message)
    .matches(/(personal|commercial)/, errors.licenseTypeInvalid.message)
    .required(errors.licenseTypeRequired.message),
});

export const loginValidation = Yup.object().shape({
  userUsername: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .min(5, errors.userUsernameMin.message)
    .max(20, errors.userUsernameMax.message)
    .lowercase()
    .required(errors.userUsernameRequired.message),
  userPassword: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .min(8, errors.userPasswordMin.message)
    .required(errors.userPasswordRequired.message),
});

export const addArtwork = Yup.object().shape({
  artworkMedia: Yup.mixed()
    .required(errors.artworkMediaRequired.message)
    .test(
      "fileType",
      errors.artworkMediaType.message,
      (value) => value && upload.artwork.mimeTypes.includes(value.type)
    )
    .test(
      "fileSize",
      // 1048576 = 1024 * 1024
      errors.artworkMediaSize.message,
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
      errors.userMediaType.message,
      (value) => !value || (value && upload.user.mimeTypes.includes(value.type))
    )
    .test(
      "fileSize",
      errors.userMediaSize.message,
      (value) => !value || (value && value.size <= upload.user.fileSize)
    ),
});

export const orderValidation = Yup.object().shape({
  orderBuyer: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .required(errors.requiredValue.message),
  orderSeller: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .required(errors.requiredValue.message),
  orderArtwork: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .required(errors.requiredValue.message),
  orderVersion: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .required(errors.requiredValue.message),
  orderDiscount: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .nullable(errors.requiredValue.message),
  orderLicense: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .required(errors.requiredValue.message),
  orderSpent: Yup.number()
    .typeError(errors.invalidNumber.message)
    .integer()
    .required(errors.requiredValue.message),
  orderEarned: Yup.number()
    .typeError(errors.invalidNumber.message)
    .integer()
    .required(errors.requiredValue.message),
  orderFee: Yup.number()
    .typeError(errors.invalidNumber.message)
    .integer()
    .required(errors.requiredValue.message),
  orderIntent: Yup.string(errors.orderIntentInvalid.message).required(
    errors.requiredValue.message
  ),
});

export const downloadValidation = Yup.object().shape({
  orderBuyer: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .required(errors.requiredValue.message),
  orderSeller: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .required(errors.requiredValue.message),
  orderArtwork: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .required(errors.requiredValue.message),
  orderVersion: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .required(errors.requiredValue.message),
  orderDiscount: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .nullable(errors.requiredValue.message),
  orderLicense: Yup.string()
    .typeError(errors.invalidString.message)
    .uuid(errors.invalidUUID.message)
    .required(errors.requiredValue.message),
  orderSpent: Yup.number()
    .typeError(errors.invalidNumber.message)
    .integer()
    .required(errors.requiredValue.message),
  orderEarned: Yup.number()
    .typeError(errors.invalidNumber.message)
    .integer()
    .required(errors.requiredValue.message),
  orderFee: Yup.number()
    .typeError(errors.invalidNumber.message)
    .integer()
    .required(errors.requiredValue.message),
});

export const originValidation = Yup.object().shape({
  userBusinessAddress: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.originCountryRequired.message),
});

export const passwordValidation = Yup.object().shape({
  userCurrent: Yup.string()
    .typeError(errors.invalidString.message)
    .required(errors.userPasswordRequired.message),
  userPassword: Yup.string()
    .typeError(errors.invalidString.message)
    .min(8, errors.userPasswordMin.message)
    .required(errors.userNewRequired.message),
  userConfirm: Yup.string()
    .typeError(errors.invalidString.message)
    .when(["userPassword"], {
      is: (userPassword) => userPassword && userPassword.trim() !== "",
      then: Yup.string()
        .typeError(errors.invalidString.message)
        .oneOf([Yup.ref("userPassword")], errors.userPasswordMismatch.message)
        .required(errors.userConfirmationRequired.message),
      otherwise: Yup.string()
        .typeError(errors.invalidString.message)
        .required(errors.userConfirmationRequired.message),
    }),
});

export const preferencesValidation = Yup.object().shape({
  userFavorites: Yup.boolean(errors.invalidValue.message).required(
    errors.favoritesPreferenceRequired.message
  ),
});

export const profileValidation = Yup.object().shape({
  userDescription: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .max(250, errors.userDescriptionMax.message),
  userCountry: Yup.string().typeError(errors.invalidString.message).trim(),
});

export const resetValidation = Yup.object().shape({
  // $TODO Add proper password validation
  userPassword: Yup.string()
    .typeError(errors.invalidString.message)
    .min(8, errors.userPasswordMin.message)
    .required(errors.userPasswordRequired.message),
  userConfirm: Yup.string()
    .typeError(errors.invalidString.message)
    .when(["userPassword"], {
      is: (userPassword) => userPassword && userPassword.trim() !== "",
      then: Yup.string()
        .typeError(errors.invalidString.message)
        .oneOf([Yup.ref("userPassword")], errors.userPasswordMismatch.message)
        .required(errors.userConfirmationRequired.message),
      otherwise: Yup.string()
        .typeError(errors.invalidString.message)
        .required(errors.userConfirmationRequired.message),
    }),
});

export const reviewValidation = Yup.object().shape({
  reviewRating: Yup.number()
    .typeError(errors.invalidNumber.message)
    .min(1, errors.reviewRatingMin.message)
    .max(5, errors.reviewRatingMax.message)
    .required(errors.reviewRatingRequired.message),
});

export const searchValidation = Yup.object().shape({
  searchQuery: Yup.string().typeError(errors.invalidString.message),
  searchType: Yup.string()
    .typeError(errors.invalidString.message)
    .matches(/(artwork|users)/, errors.searchTypeInvalid.message)
    .required(errors.searchTypeRequired.message),
});

export const signupValidation = Yup.object().shape({
  userUsername: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .matches(/^([\w.]){0,}$/, errors.userUsernameInvalid.message)
    .min(5, errors.userUsernameMin.message)
    .max(20, errors.userUsernameMax.message)
    .lowercase()
    .required(errors.userUsernameRequired.message),
  userEmail: Yup.string()
    .typeError(errors.invalidString.message)
    .email(errors.userEmailInvalid.message)
    .required(errors.userEmailRequired.message),
  userPassword: Yup.string()
    .typeError(errors.invalidString.message)
    .min(8, errors.userPasswordMin.message)
    .required(errors.userPasswordRequired.message),
  userConfirm: Yup.string()
    .typeError(errors.invalidString.message)
    .when(["userPassword"], {
      is: (userPassword) => userPassword && userPassword.trim() !== "",
      then: Yup.string()
        .typeError(errors.invalidString.message)
        .oneOf([Yup.ref("userPassword")], errors.userPasswordMismatch.message)
        .required(errors.userConfirmationRequired.message),
      otherwise: Yup.string()
        .typeError(errors.invalidString.message)
        .required(errors.userConfirmationRequired.message),
    }),
});

export const ticketValidation = Yup.object().shape({
  ticketTitle: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(),
  ticketBody: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(),
});

export const fingerprintValidation = Yup.object().shape({
  licenseFingerprint: Yup.string()
    .typeError(errors.invalidString.message)
    .trim()
    .required(errors.licenseFingerprintRequired.message),
});

export const recoveryValidation = Yup.object().shape({
  userUsername: Yup.string()
    .typeError(errors.invalidString.message)
    .required(errors.userUsernameRequired.message),
  userEmail: Yup.string()
    .typeError(errors.invalidString.message)
    .email(errors.userEmailInvalid.message)
    .required(errors.userEmailRequired.message),
  userPassword: Yup.string()
    .typeError(errors.invalidString.message)
    .min(8, errors.userPasswordMin.message)
    .required(errors.userPasswordRequired.message),
});

export const emptyValidation = Yup.object().shape({});
