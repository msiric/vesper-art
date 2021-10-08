import * as Yup from "yup";
import {
  countries,
  generatedData,
  pricing,
  statusCodes,
  upload,
  usernames,
} from "./constants";
import { formatArtworkPrice, formatMimeTypes } from "./helpers";

export const ranges = {
  firstName: {
    max: 35,
  },
  lastName: {
    max: 35,
  },
  fullName: {
    max: 70,
  },
  email: {
    max: 320,
  },
  password: {
    min: 10,
    max: 300,
  },
  username: {
    min: 5,
    max: 20,
  },
  artworkTitle: {
    max: 70,
  },
  artworkDescription: {
    max: 300,
  },
  address: {
    max: 300,
  },
  postalCode: {
    max: 12,
  },
  city: {
    max: 100,
  },
  country: {
    // $TODO not sure if this is correct
    max: 2,
  },
  comment: {
    max: 300,
  },
  discountCode: {
    max: 50,
  },
  company: {
    max: 100,
  },
  intentId: {
    exact: 27,
  },
  profileDescription: {
    max: 250,
  },
  searchQuery: {
    max: 100,
  },
  licenseFingerprint: {
    // because of hex value (if 20 is passed to randomBytes, 40 characters will get returned, hence the doubling)
    exact: generatedData.fingerprint * 2,
  },
  licenseIdentifier: {
    // because of hex value (if 10 is passed to randomBytes, 20 characters will get returned, hence the doubling)
    exact: generatedData.identifier * 2,
  },
  freePricing: {
    exact: 0,
  },
  reviewRating: {
    min: 1,
    max: 5,
  },
};

export const errors = {
  artworkTitleRequired: {
    status: statusCodes.badRequest,
    message: "Artwork title is required",
    expose: true,
  },
  artworkTitleMax: {
    status: statusCodes.badRequest,
    message: `Artwork title cannot contain more than ${ranges.artworkTitle.max} characters`,
    expose: true,
  },
  artworkAvailabilityRequired: {
    status: statusCodes.badRequest,
    message: "Artwork availability is required",
    expose: true,
  },
  artworkAvailabilityInvalid: {
    status: statusCodes.badRequest,
    message: "Artwork availability is invalid",
    expose: true,
  },
  artworkTypeRequired: {
    status: statusCodes.badRequest,
    message: "Artwork type is required",
    expose: true,
  },
  artworkTypeInvalid: {
    status: statusCodes.badRequest,
    message: "Artwork type is invalid",
    expose: true,
  },
  artworkLicenseRequired: {
    status: statusCodes.badRequest,
    message: "Artwork license is required",
    expose: true,
  },
  artworkLicenseInvalid: {
    status: statusCodes.badRequest,
    message: "Artwork license is invalid",
    expose: true,
  },
  artworkPersonalRequired: {
    status: statusCodes.badRequest,
    message: "Personal license is required",
    expose: true,
  },
  artworkPersonalNegative: {
    status: statusCodes.badRequest,
    message: "Personal license cannot be negative",
    expose: true,
  },
  artworkPersonalMin: {
    status: statusCodes.badRequest,
    message: `Personal license cannot be less than ${formatArtworkPrice({
      price: pricing.minimumPrice,
    })}`,
    expose: true,
  },
  artworkPersonalMax: {
    status: statusCodes.badRequest,
    message: `Personal license cannot be greater than ${formatArtworkPrice({
      price: pricing.maximumPrice,
    })}`,
    expose: true,
  },
  artworkLicenseMin: {
    status: statusCodes.badRequest,
    message: `License price cannot be less than ${formatArtworkPrice({
      price: pricing.minimumPrice,
    })}`,
    expose: true,
  },
  artworkLicenseMax: {
    status: statusCodes.badRequest,
    message: `License price cannot be greater than ${formatArtworkPrice({
      price: pricing.maximumPrice,
    })}`,
    expose: true,
  },
  artworkLicenseFree: {
    status: statusCodes.badRequest,
    message: "Free license cannot have a price",
    expose: true,
  },
  artworkLicenseMax: {
    status: statusCodes.badRequest,
    message: `License price cannot be greater than ${formatArtworkPrice({
      price: pricing.maximumPrice,
    })}`,
    expose: true,
  },
  artworkLicenseRequired: {
    status: statusCodes.badRequest,
    message: "License price is required",
    expose: true,
  },
  artworkUseRequired: {
    status: statusCodes.badRequest,
    message: "Artwork use is required",
    expose: true,
  },
  artworkUseInvalid: {
    status: statusCodes.badRequest,
    message: "Artwork use is invalid",
    expose: true,
  },
  artworkCommercialRequired: {
    status: statusCodes.badRequest,
    message: "Commercial license is required",
    expose: true,
  },
  artworkCommercialNegative: {
    status: statusCodes.badRequest,
    message: "Commercial license cannot be negative",
    expose: true,
  },
  artworkCommercialMin: {
    status: statusCodes.badRequest,
    message:
      "Commercial license cannot be less than the cost of the personal license",
    expose: true,
  },
  artworkCommercialMax: {
    status: statusCodes.badRequest,
    message: `Commercial license cannot be greater than ${formatArtworkPrice({
      price: pricing.maximumPrice,
    })}`,
    expose: true,
  },
  artworkVisibilityRequired: {
    status: statusCodes.badRequest,
    message: "Artwork visibility is required",
    expose: true,
  },
  artworkVisibilityInvalid: {
    status: statusCodes.badRequest,
    message: "Artwork visibility is invalid",
    expose: true,
  },
  artworkDescriptionMax: {
    status: statusCodes.badRequest,
    message: `Artwork description cannot contain more than ${ranges.artworkDescription.max} characters`,
    expose: true,
  },
  billingNameRequired: {
    status: statusCodes.badRequest,
    message: "First name is required",
    expose: true,
  },
  billingNameMax: {
    status: statusCodes.badRequest,
    message: `First name cannot contain more than ${ranges.firstName.max} characters`,
    expose: true,
  },
  billingSurnameRequired: {
    status: statusCodes.badRequest,
    message: "Last name is required",
    expose: true,
  },
  billingSurnameMax: {
    status: statusCodes.badRequest,
    message: `Last name cannot contain more than ${ranges.lastName.max} characters`,
    expose: true,
  },
  billingAddressRequired: {
    status: statusCodes.badRequest,
    message: "Address is required",
    expose: true,
  },
  billingAddressMax: {
    status: statusCodes.badRequest,
    message: `Address cannot contain more than ${ranges.address.max} characters`,
    expose: true,
  },
  billingZipRequired: {
    status: statusCodes.badRequest,
    message: "Postal code is required",
    expose: true,
  },
  billingZipMax: {
    status: statusCodes.badRequest,
    message: `Postal code cannot contain more than ${ranges.postalCode.max} characters`,
    expose: true,
  },
  billingCityRequired: {
    status: statusCodes.badRequest,
    message: "City is required",
    expose: true,
  },
  billingCityMax: {
    status: statusCodes.badRequest,
    message: `City cannot contain more than ${ranges.city.max} characters`,
    expose: true,
  },
  billingCountryRequired: {
    status: statusCodes.badRequest,
    message: "Country is required",
    expose: true,
  },
  billingCountryMax: {
    status: statusCodes.badRequest,
    message: `Country cannot contain more than ${ranges.country.max} characters`,
    expose: true,
  },
  commentContentRequired: {
    status: statusCodes.badRequest,
    message: "Comment cannot be empty",
    expose: true,
  },
  commentContentMax: {
    status: statusCodes.badRequest,
    message: `Comment cannot contain more than ${ranges.comment.max} characters`,
    expose: true,
  },
  discountCodeRequired: {
    status: statusCodes.badRequest,
    message: "Discount cannot be empty",
    expose: true,
  },
  discountCodeMax: {
    status: statusCodes.badRequest,
    message: `Discount code cannot contain more than ${ranges.discountCode.max} characters`,
    expose: true,
  },
  licenseAssigneeRequired: {
    status: statusCodes.badRequest,
    message: "License assignee is required",
    expose: true,
  },
  licenseAssigneeMax: {
    status: statusCodes.badRequest,
    message: `License assignee cannot contain more than ${ranges.fullName.max} characters`,
    expose: true,
  },
  licenseAssignorRequired: {
    status: statusCodes.badRequest,
    message: "License assignor is required",
    expose: true,
  },
  licenseAssignorMax: {
    status: statusCodes.badRequest,
    message: `License assignor cannot contain more than ${ranges.fullName.max} characters`,
    expose: true,
  },
  licenseTypeRequired: {
    status: statusCodes.badRequest,
    message: "License type is required",
    expose: true,
  },
  licenseTypeInvalid: {
    status: statusCodes.badRequest,
    message: "License type is invalid",
    expose: true,
  },
  licenseCompanyInvalid: {
    status: statusCodes.badRequest,
    message: "License company is invalid",
    expose: true,
  },
  licenseUsageInvalid: {
    status: statusCodes.badRequest,
    message: "License usage is invalid",
    expose: true,
  },
  licenseCompanyRequired: {
    status: statusCodes.badRequest,
    message: "License company is required",
    expose: true,
  },
  licenseCompanyMax: {
    status: statusCodes.badRequest,
    message: `License company cannot contain more than ${ranges.company.max} characters`,
    expose: true,
  },
  userNameRequired: {
    status: statusCodes.badRequest,
    message: "Full name is required",
    expose: true,
  },
  userNameMax: {
    status: statusCodes.badRequest,
    message: `Full name cannot contain more than ${ranges.fullName.max} characters`,
    expose: true,
  },
  userUsernameRequired: {
    status: statusCodes.badRequest,
    message: "Username is required",
    expose: true,
  },
  userUsernameMin: {
    status: statusCodes.badRequest,
    message: `Username must contain at least ${ranges.username.min} characters`,
    expose: true,
  },
  userUsernameMax: {
    status: statusCodes.badRequest,
    message: `Username cannot contain more than ${ranges.username.max} characters`,
    expose: true,
  },
  userPasswordRequired: {
    status: statusCodes.badRequest,
    message: "Enter your password",
    expose: true,
  },
  userPasswordMin: {
    status: statusCodes.badRequest,
    message: `Password must contain at least ${ranges.password.min} characters`,
    expose: true,
  },
  userPasswordMax: {
    status: statusCodes.badRequest,
    message: `Password cannot contain more than ${ranges.password.max} characters`,
    expose: true,
  },
  artworkMediaRequired: {
    status: statusCodes.badRequest,
    message: "Artwork needs to have a file",
    expose: true,
  },
  artworkMediaType: {
    status: statusCodes.badRequest,
    message: `File needs to be in one of the following formats: ${formatMimeTypes(
      upload.artwork.mimeTypes
    )}`,
    expose: true,
  },
  artworkMediaSize: {
    status: statusCodes.badRequest,
    message: `File needs to be less than ${
      upload.artwork.fileSize / 1048576
    }MB`,
    expose: true,
  },
  userMediaType: {
    status: statusCodes.badRequest,
    message: `File needs to be in one of the following formats: ${formatMimeTypes(
      upload.user.mimeTypes
    )}`,
    expose: true,
  },
  userMediaSize: {
    status: statusCodes.badRequest,
    message: `File needs to be less than ${upload.user.fileSize / 1048576}MB`,
    expose: true,
  },
  orderIntentInvalid: {
    status: statusCodes.badRequest,
    message: "Invalid intent",
    expose: true,
  },
  orderIntentExact: {
    status: statusCodes.badRequest,
    message: "Intent ID is invalid",
    expose: true,
  },
  originCountryRequired: {
    status: statusCodes.badRequest,
    message: "Country cannot be empty",
    expose: true,
  },
  originCountryMax: {
    status: statusCodes.badRequest,
    message: `Country cannot contain more than ${ranges.country.max} characters`,
    expose: true,
  },
  userNewRequired: {
    status: statusCodes.badRequest,
    message: "Enter new password",
    expose: true,
  },
  userConfirmationRequired: {
    status: statusCodes.badRequest,
    message: "Confirm your password",
    expose: true,
  },
  userPasswordMismatch: {
    status: statusCodes.badRequest,
    message: "Passwords do not match",
    expose: true,
  },
  favoritesPreferenceRequired: {
    status: statusCodes.badRequest,
    message: "Favorites need to have a value",
    expose: true,
  },
  userDescriptionMax: {
    status: statusCodes.badRequest,
    message: `Description cannot contain more than ${ranges.profileDescription.max} characters`,
    expose: true,
  },
  reviewRatingRequired: {
    status: statusCodes.badRequest,
    message: "Rating cannot be empty",
    expose: true,
  },
  reviewRatingMin: {
    status: statusCodes.badRequest,
    message: `Rating cannot be less than ${ranges.reviewRating.min}`,
    expose: true,
  },
  reviewRatingMax: {
    status: statusCodes.badRequest,
    message: `Rating cannot be greater than ${ranges.reviewRating.max}`,
    expose: true,
  },
  searchQueryMax: {
    status: statusCodes.badRequest,
    message: `Search query cannot contain more than ${ranges.searchQuery.max} characters`,
    expose: true,
  },
  searchTypeRequired: {
    status: statusCodes.badRequest,
    message: "Search type is required",
    expose: true,
  },
  searchTypeInvalid: {
    status: statusCodes.badRequest,
    message: "Search type is invalid",
    expose: true,
  },
  userUsernameInvalid: {
    status: statusCodes.badRequest,
    message:
      "Username can only contain letters, numbers, underscores and periods",
    expose: true,
  },
  userUsernameBlacklisted: {
    status: statusCodes.badRequest,
    message: "Username not allowed",
    expose: true,
  },
  licenseFingerprintRequired: {
    status: statusCodes.badRequest,
    message: "License fingerprint cannot be empty",
    expose: true,
  },
  licenseFingerprintExact: {
    status: statusCodes.badRequest,
    message: "License fingerprint is invalid",
    expose: true,
  },
  assigneeIdentifierExact: {
    status: statusCodes.badRequest,
    message: "Assignee identifier is invalid",
    expose: true,
  },
  assignorIdentifierExact: {
    status: statusCodes.badRequest,
    message: "Assignor identifier is invalid",
    expose: true,
  },
  userEmailRequired: {
    status: statusCodes.badRequest,
    message: "Email is required",
    expose: true,
  },
  userEmailMax: {
    status: statusCodes.badRequest,
    message: `Email cannot contain more than ${ranges.email.max} characters`,
    expose: true,
  },
  userEmailInvalid: {
    status: statusCodes.badRequest,
    message: "Invalid email",
    expose: true,
  },
  userCountryMax: {
    status: statusCodes.badRequest,
    message: `Country contain more than ${ranges.country.max} characters`,
    expose: true,
  },
  invalidUserCountry: {
    status: statusCodes.badRequest,
    message: "Selected country is invalid",
    expose: true,
  },
  invalidStripeCountry: {
    status: statusCodes.badRequest,
    message: "Selected country is not currently supported by Stripe",
    expose: true,
  },
  requiredValue: {
    status: statusCodes.badRequest,
    message: "Required value",
    expose: true,
  },
  invalidUUID: {
    status: statusCodes.badRequest,
    message: "Invalid UUID",
    expose: true,
  },
  invalidValue: {
    status: statusCodes.badRequest,
    message: "Invalid value",
    expose: true,
  },
  invalidString: {
    status: statusCodes.badRequest,
    message: "Value needs to be a string",
    expose: true,
  },
  invalidNumber: {
    status: statusCodes.badRequest,
    message: "Value needs to be a positive integer",
    expose: true,
  },
};

export const validateUserCountry = (value) =>
  countries.some((item) => item.value === value);

export const validateStripeCountry = (value) =>
  countries.some((item) => item.supported === true && item.value === value);

const userUsername = Yup.string()
  .trim()
  .typeError(errors.invalidString.message)
  .required(errors.userUsernameRequired.message)
  .matches(/^([\w.]){0,}$/, errors.userUsernameInvalid.message)
  .min(ranges.username.min, errors.userUsernameMin.message)
  .max(ranges.username.max, errors.userUsernameMax.message)
  .test(
    "isValidUsername",
    errors.userUsernameBlacklisted.message,
    (value) => !usernames[value]
  );

const userEmail = Yup.string()
  .email(errors.userEmailInvalid.message)
  .trim()
  .typeError(errors.invalidString.message)
  .required(errors.userEmailRequired.message)
  .max(ranges.email.max, errors.userEmailMax.message);

const userPassword = (error = "userPasswordRequired") =>
  Yup.string()
    .typeError(errors.invalidString.message)
    .required(errors[error].message)
    .min(ranges.password.min, errors.userPasswordMin.message)
    .max(ranges.password.max, errors.userPasswordMax.message);

const userConfirm = Yup.string()
  .typeError(errors.invalidString.message)
  .when(["userPassword"], {
    is: (userPassword) => userPassword && userPassword.trim() !== "",
    then: Yup.string()
      .typeError(errors.invalidString.message)
      .required(errors.userConfirmationRequired.message)
      .oneOf([Yup.ref("userPassword")], errors.userPasswordMismatch.message),
    otherwise: Yup.string()
      .typeError(errors.invalidString.message)
      .required(errors.userConfirmationRequired.message),
  });

export const artworkValidation = Yup.object().shape({
  artworkTitle: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.artworkTitleRequired.message)
    .max(ranges.artworkTitle.max, errors.artworkTitleMax.message),
  artworkAvailability: Yup.string()
    .typeError(errors.invalidString.message)
    .required(errors.artworkAvailabilityRequired.message)
    .matches(
      /(available|unavailable)/,
      errors.artworkAvailabilityInvalid.message
    ),
  artworkType: Yup.string()
    .typeError(errors.invalidString.message)
    .notRequired()
    .when("artworkAvailability", {
      is: "available",
      then: Yup.string()
        .typeError(errors.invalidString.message)
        .required(errors.artworkTypeRequired.message)
        .matches(/(commercial|free)/, errors.artworkTypeInvalid.message),
      otherwise: Yup.string()
        .typeError(errors.invalidString.message)
        .matches(/(unavailable)/, errors.artworkTypeInvalid.message),
    }),
  artworkLicense: Yup.string()
    .typeError(errors.invalidString.message)
    .notRequired()
    .when("artworkAvailability", {
      is: "available",
      then: Yup.string()
        .typeError(errors.invalidString.message)
        .required(errors.artworkLicenseRequired.message)
        .matches(/(commercial|personal)/, errors.artworkLicenseInvalid.message),
      otherwise: Yup.string()
        .typeError(errors.invalidString.message)
        .matches(/(unavailable)/, errors.artworkLicenseInvalid.message),
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
        .typeError(errors.invalidNumber.message)
        .required(errors.artworkPersonalRequired.message)
        .min(pricing.minimumPrice, errors.artworkPersonalMin.message)
        .max(pricing.maximumPrice, errors.artworkPersonalMax.message),
      otherwise: Yup.number()
        .integer()
        .min(ranges.freePricing.exact)
        .max(ranges.freePricing.exact)
        .typeError(errors.invalidNumber.message),
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
        .matches(/(unavailable)/, errors.artworkUseInvalid.message),
    }),
  artworkCommercial: Yup.number()
    .typeError(errors.invalidNumber.message)
    .notRequired()
    .when(["artworkAvailability", "artworkLicense"], {
      is: (artworkAvailability, artworkLicense) =>
        artworkAvailability === "available" && artworkLicense === "commercial",
      then: Yup.number()
        .typeError(errors.invalidNumber.message)
        .when(["artworkUse"], {
          is: (artworkUse) => artworkUse === "separate",
          then: Yup.number()
            .typeError(errors.invalidNumber.message)
            .when(["artworkType"], {
              is: (artworkType) => artworkType === "free",
              then: Yup.number()
                .typeError(errors.invalidNumber.message)
                .positive(errors.artworkCommercialNegative.message)
                .typeError(errors.invalidNumber.message)
                .required(errors.artworkCommercialRequired.message)
                .min(pricing.minimumPrice, errors.artworkCommercialMin.message)
                .max(pricing.maximumPrice, errors.artworkCommercialMax.message),
              otherwise: Yup.number()
                .integer()
                .positive(errors.artworkCommercialNegative.message)
                .typeError(errors.invalidNumber.message)
                .required(errors.artworkCommercialRequired.message)
                .moreThan(
                  Yup.ref("artworkPersonal"),
                  errors.artworkCommercialMin.message
                )
                .max(pricing.maximumPrice, errors.artworkCommercialMax.message),
            }),
          otherwise: Yup.number()
            .typeError(errors.invalidNumber.message)
            .when(["artworkType"], {
              is: (artworkType) => artworkType === "free",
              then: Yup.number()
                .typeError(errors.invalidNumber.message)
                .positive(errors.artworkCommercialNegative.message)
                .typeError(errors.invalidNumber.message)
                .min(ranges.freePricing.exact)
                .max(ranges.freePricing.exact),
              otherwise: Yup.number()
                .integer()
                .typeError(errors.invalidNumber.message)
                .min(Yup.ref("artworkPersonal"))
                .max(Yup.ref("artworkPersonal")),
            }),
        }),
      otherwise: Yup.number()
        .integer()
        .typeError(errors.invalidNumber.message)
        .required(errors.artworkCommercialRequired.message)
        .min(ranges.freePricing.exact)
        .max(ranges.freePricing.exact),
    }),
  // artworkCategory: "",
  // artworkTags: Yup.array()
  //   .of(Yup.string().typeError(errors.invalidString.message))
  //   .min(1, "At least one tag is required")
  //   .max(5, "At most five tags are permitted")
  //   .required("Artwork tags are required"),
  artworkVisibility: Yup.string()
    .typeError(errors.invalidString.message)
    .required(errors.artworkVisibilityRequired.message)
    .matches(/(visible|invisible)/, errors.artworkVisibilityInvalid.message),
  artworkDescription: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .max(ranges.artworkDescription.max, errors.artworkDescriptionMax.message),
});

export const billingValidation = Yup.object().shape({
  billingName: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.billingNameRequired.message)
    .max(ranges.firstName.max, errors.billingNameMax.message),
  billingSurname: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.billingSurnameRequired.message)
    .max(ranges.lastName.max, errors.billingSurnameMax.message),
  billingEmail: userEmail,
  billingAddress: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.billingAddressRequired.message)
    .max(ranges.address.max, errors.billingSurnameMax.message),
  billingZip: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.billingZipRequired.message)
    .max(ranges.postalCode.max, errors.billingZipMax.message),
  billingCity: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.billingCityRequired.message)
    .max(ranges.city.max, errors.billingCityMax.message),
  billingCountry: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.billingCountryRequired.message)
    .max(ranges.country.max, errors.billingCountryMax.message)
    .test("isValidCountry", errors.invalidUserCountry.message, (value) =>
      validateUserCountry(value)
    ),
});

export const commentValidation = Yup.object().shape({
  commentContent: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.commentContentRequired.message)
    .max(ranges.comment.max, errors.commentContentMax.message),
});

export const discountValidation = Yup.object().shape({
  discountCode: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.discountCodeRequired.message)
    .max(ranges.discountCode.max, errors.discountCodeMax.message),
});

export const emailValidation = Yup.object().shape({
  userEmail,
});

export const licenseValidation = Yup.object().shape({
  licenseUsage: Yup.string()
    .typeError(errors.invalidString.message)
    .required(errors.licenseTypeRequired.message)
    .matches(/(individual|business)/, errors.licenseUsageInvalid.message),
  licenseCompany: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .notRequired()
    .when(["licenseUsage"], {
      is: (licenseUsage) => licenseUsage === "business",
      then: Yup.string()
        .trim()
        .typeError(errors.invalidString.message)
        .required(errors.licenseCompanyRequired.message)
        .max(ranges.company.max, errors.licenseCompanyMax.message),
      otherwise: Yup.string()
        .typeError(errors.invalidString.message)
        .matches(/(unavailable)/, errors.licenseCompanyInvalid.message),
    }),
  licenseType: Yup.string()
    .typeError(errors.invalidString.message)
    .required(errors.licenseTypeRequired.message)
    .matches(/(personal|commercial)/, errors.licenseTypeInvalid.message),
});

export const actorsValidation = Yup.object().shape({
  licenseAssignee: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.licenseAssigneeRequired.message)
    .max(ranges.fullName.max, errors.licenseAssigneeMax.message),
  licenseAssignor: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.licenseAssignorRequired.message)
    .max(ranges.fullName.max, errors.licenseAssignorMax.message),
});

// for commercial artwork
export const priceValidation = Yup.object().shape({
  licensePrice: Yup.number()
    .integer()
    .typeError(errors.invalidNumber.message)
    .required(errors.artworkLicenseRequired.message)
    // multiplied by 100 to accommodate for the integer value being passed for currencies
    .min(ranges.freePricing.exact * 100, errors.artworkLicenseMin.message)
    // multiplied by 100 to accommodate for the integer value being passed for currencies
    .max(pricing.maximumPrice * 100, errors.artworkLicenseMax.message),
});

// for free downloads
export const freeValidation = Yup.object().shape({
  licensePrice: Yup.number()
    .integer()
    .typeError(errors.invalidNumber.message)
    .required(errors.artworkLicenseRequired.message)
    .min(0, errors.artworkLicenseFree.message)
    .max(0, errors.artworkLicenseFree.message),
});

export const loginValidation = Yup.object().shape({
  userUsername,
  userPassword: userPassword(),
});

export const mediaValidation = Yup.object().shape({
  artworkMedia: Yup.mixed()
    .test(
      "fileType",
      errors.artworkMediaType.message,
      (value) =>
        value && Object.keys(upload.artwork.mimeTypes).includes(value.type)
    )
    .test(
      "fileSize",
      // 1048576 = 1024 * 1024
      errors.artworkMediaSize.message,
      (value) => value && value.size <= upload.artwork.fileSize
    )
    .test(
      "fileRequired",
      errors.artworkMediaRequired.message,
      (value) => value
    ),
});

export const avatarValidation = Yup.object().shape({
  userMedia: Yup.mixed()
    .test(
      "fileType",
      errors.userMediaType.message,
      (value) =>
        !value ||
        (value && Object.keys(upload.user.mimeTypes).includes(value.type))
    )
    .test(
      "fileSize",
      errors.userMediaSize.message,
      (value) => !value || (value && value.size <= upload.user.fileSize)
    ),
});

export const intentValidation = Yup.object().shape({
  orderIntent: Yup.string(errors.orderIntentInvalid.message)
    .required(errors.requiredValue.message)
    .max(ranges.intentId.exact, errors.orderIntentExact.message)
    .max(ranges.intentId.exact, errors.orderIntentExact.message),
});

export const orderValidation = Yup.object().shape({
  orderBuyer: Yup.string()
    .uuid(errors.invalidUUID.message)
    .typeError(errors.invalidString.message)
    .required(errors.requiredValue.message),
  orderSeller: Yup.string()
    .uuid(errors.invalidUUID.message)
    .typeError(errors.invalidString.message)
    .required(errors.requiredValue.message),
  orderArtwork: Yup.string()
    .uuid(errors.invalidUUID.message)
    .typeError(errors.invalidString.message)
    .required(errors.requiredValue.message),
  orderVersion: Yup.string()
    .uuid(errors.invalidUUID.message)
    .typeError(errors.invalidString.message)
    .required(errors.requiredValue.message),
  orderDiscount: Yup.string()
    .uuid(errors.invalidUUID.message)
    .typeError(errors.invalidString.message)
    .nullable(errors.requiredValue.message),
  orderLicense: Yup.string()
    .uuid(errors.invalidUUID.message)
    .typeError(errors.invalidString.message)
    .required(errors.requiredValue.message),
  orderSpent: Yup.number()
    .integer()
    .typeError(errors.invalidNumber.message)
    .required(errors.requiredValue.message),
  orderEarned: Yup.number()
    .integer()
    .typeError(errors.invalidNumber.message)
    .required(errors.requiredValue.message),
  orderFee: Yup.number()
    .integer()
    .typeError(errors.invalidNumber.message)
    .required(errors.requiredValue.message),
});

export const originValidation = Yup.object().shape({
  userBusinessAddress: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.originCountryRequired.message)
    .max(ranges.address.max, errors.originCountryMax.message)
    .test("isValidCountry", errors.invalidStripeCountry.message, (value) =>
      validateStripeCountry(value)
    ),
});

export const passwordValidation = Yup.object().shape({
  userCurrent: userPassword(),
  userPassword: userPassword("userNewRequired"),
  userConfirm,
});

export const preferencesValidation = Yup.object().shape({
  userFavorites: Yup.boolean()
    .typeError(errors.invalidValue.message)
    .required(errors.favoritesPreferenceRequired.message),
});

export const profileValidation = Yup.object().shape({
  userDescription: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .max(ranges.profileDescription.max, errors.userDescriptionMax.message),
  userCountry: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .max(ranges.country.max, errors.userCountryMax.message)
    .test("isValidCountry", errors.invalidUserCountry.message, (value) =>
      validateUserCountry(value)
    ),
});

export const resetValidation = Yup.object().shape({
  userPassword: userPassword("userNewRequired"),
  userConfirm,
});

export const reviewValidation = Yup.object().shape({
  reviewRating: Yup.number()
    .typeError(errors.invalidNumber.message)
    .required(errors.reviewRatingRequired.message)
    .min(ranges.reviewRating.min, errors.reviewRatingMin.message)
    .max(ranges.reviewRating.max, errors.reviewRatingMax.message),
});

export const searchValidation = Yup.object().shape({
  searchQuery: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .max(ranges.searchQuery.max, errors.searchQueryMax.message),
  searchType: Yup.string()
    .typeError(errors.invalidString.message)
    .required(errors.searchTypeRequired.message)
    .matches(/(artwork|users)/, errors.searchTypeInvalid.message),
});

export const signupValidation = Yup.object().shape({
  userName: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(errors.userNameRequired.message)
    .max(ranges.fullName.max, errors.userNameMax.message),
  userUsername,
  userEmail,
  userPassword: userPassword(),
  userConfirm,
});

export const ticketValidation = Yup.object().shape({
  ticketTitle: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(),
  ticketBody: Yup.string()
    .trim()
    .typeError(errors.invalidString.message)
    .required(),
});

export const fingerprintValidation = Yup.object().shape({
  licenseFingerprint: Yup.string()
    .typeError(errors.invalidString.message)
    .required(errors.licenseFingerprintRequired.message)
    .max(
      ranges.licenseFingerprint.exact,
      errors.licenseFingerprintExact.message
    ),
  assigneeIdentifier: Yup.string()
    .typeError(errors.invalidString.message)
    .max(
      ranges.licenseIdentifier.exact,
      errors.assigneeIdentifierExact.message
    ),
  assignorIdentifier: Yup.string()
    .typeError(errors.invalidString.message)
    .max(
      ranges.licenseIdentifier.exact,
      errors.assignorIdentifierExact.message
    ),
});

export const recoveryValidation = Yup.object().shape({
  userUsername,
  userEmail,
  userPassword: userPassword(),
});

export const emptyValidation = Yup.object().shape({});
