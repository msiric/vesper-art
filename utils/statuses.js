import { statusCodes } from "../common/constants";

export const errors = {
  userNotFound: {
    status: statusCodes.notFound,
    message: "User not found",
    expose: true,
  },
  artworkNotFound: {
    status: statusCodes.notFound,
    message: "Artwork not found",
    expose: true,
  },
  commentNotFound: {
    status: statusCodes.notFound,
    message: "Comment not found",
    expose: true,
  },
  commercialArtworkUnavailable: {
    status: statusCodes.internalError,
    message: "Creating commercial artwork is not yet available",
    expose: true,
  },
  stripeOnboardingIncomplete: {
    status: statusCodes.unprocessable,
    message:
      "Please complete the Stripe onboarding process before making your artwork commercially available",
    expose: true,
  },
  stripeOnboardingInvalid: {
    status: statusCodes.internalError,
    message: "There was an error in the onboarding process",
    expose: true,
  },
  stripeAccountIncomplete: {
    status: statusCodes.unprocessable,
    message:
      "Please complete your Stripe account before making your artwork commercially available",
    expose: true,
  },
  stripeDashboardUnavailable: {
    status: statusCodes.unprocessable,
    message:
      "You need to complete the onboarding process before accessing your Stripe dashboard",
    expose: true,
  },
  stripeBalanceUncleared: {
    status: statusCodes.unprocessable,
    message:
      "Cannot delete your account until all balances in your Stripe dashboard are zero",
    expose: true,
  },
  notificationNotFound: {
    status: statusCodes.notFound,
    message: "Notification not found",
    expose: true,
  },
  artworkMediaMissing: {
    status: statusCodes.badRequest,
    message: "Please attach artwork media before submitting",
    expose: true,
  },
  artworkDetailsIdentical: {
    status: statusCodes.badRequest,
    message: "Artwork is identical to the previous version",
    expose: true,
  },
  artworkCheckoutByOwner: {
    status: statusCodes.badRequest,
    message: "Cannot purchase your own artwork",
    expose: true,
  },
  artworkAlreadyFavorited: {
    status: statusCodes.badRequest,
    message: "Artwork has already been favorited",
    expose: true,
  },
  artworkFavoritedByOwner: {
    status: statusCodes.badRequest,
    message: "Cannot favorite your own artwork",
    expose: true,
  },
  artworkAlreadyUnfavorited: {
    status: statusCodes.badRequest,
    message: "Artwork has already been unfavorited",
    expose: true,
  },
  artworkUnfavoritedByOwner: {
    status: statusCodes.badRequest,
    message: "Cannot unfavorite your own artwork",
    expose: true,
  },
  userAlreadyExists: {
    status: statusCodes.conflict,
    message: "Account with that email/username already exists",
    expose: true,
  },
  userDoesNotExist: {
    status: statusCodes.notFound,
    message: "Account with provided credentials does not exist",
    expose: true,
  },
  userNoLongerActive: {
    status: statusCodes.gone,
    message: "Account is no longer active",
    expose: true,
  },
  userNotVerified: {
    status: statusCodes.forbidden,
    message: "Please verify your account",
    expose: true,
  },
  verificationTokenInvalid: {
    status: statusCodes.badRequest,
    message: "Verification token is invalid or has expired",
    expose: true,
  },
  currentPasswordIncorrect: {
    status: statusCodes.badRequest,
    message: "Current password is incorrect",
    expose: true,
  },
  newPasswordIdentical: {
    status: statusCodes.badRequest,
    message: "New password cannot be identical to the old one",
    expose: true,
  },
  resetTokenInvalid: {
    status: statusCodes.badRequest,
    message: "Reset token is invalid or has expired",
    expose: true,
  },
  userAlreadyVerified: {
    status: statusCodes.badRequest,
    message: "Account is already verified",
    expose: true,
  },
  emailNotFound: {
    status: statusCodes.notFound,
    message: "Account with provided email does not exist",
    expose: true,
  },
  emailAlreadyExists: {
    status: statusCodes.conflict,
    message: "User with provided email already exists",
    expose: true,
  },
  artworkDownloadedByOwner: {
    status: statusCodes.badRequest,
    message: "You are the owner of this artwork",
    expose: true,
  },
  artworkVersionObsolete: {
    status: statusCodes.badRequest,
    message: "There is a newer version of this artwork",
    expose: true,
  },
  artworkNoLongerActive: {
    status: statusCodes.gone,
    message: "Artwork is no longer active",
    expose: true,
  },
  artworkLicenseInvalid: {
    status: statusCodes.badRequest,
    message: "License is not valid",
    expose: true,
  },
  artworkLicenseExists: {
    status: statusCodes.badRequest,
    message: "License already exists for provided credentials",
    expose: true,
  },
  discountNotFound: {
    status: statusCodes.notFound,
    message: "Discount not found",
    expose: true,
  },
  orderNotFound: {
    status: statusCodes.notFound,
    message: "Order not found",
    expose: true,
  },
  reviewAlreadyExists: {
    status: statusCodes.conflict,
    message: "Review already exists for this artwork",
    expose: true,
  },
  searchTypeInvalid: {
    status: statusCodes.badRequest,
    message: "Query type invalid",
    expose: true,
  },
  discountNotApplied: {
    status: statusCodes.internalError,
    message: "Could not apply discount",
    expose: true,
  },
  paymentNotProcessed: {
    status: statusCodes.internalError,
    message: "Could not process the payment",
    expose: true,
  },
  intentNotFound: {
    status: statusCodes.notFound,
    message: "Intent not found",
    expose: true,
  },
  orderNotProcessed: {
    status: statusCodes.internalError,
    message: "Could not process the order",
    expose: true,
  },
  userFavoritesNotAllowed: {
    status: statusCodes.notAllowed,
    message: "User keeps favorites private",
    expose: true,
  },
  licenseNotFound: {
    status: statusCodes.notFound,
    message: "License not found",
    expose: true,
  },
  licenseCompanyExists: {
    status: statusCodes.badRequest,
    message: "There is already a license assigned to the provided company",
    expose: true,
  },
  licenseAlreadyExists: {
    status: statusCodes.badRequest,
    message: "There is already an identical license assigned to you",
    expose: true,
  },
  licenseTypeSuperseded: {
    status: statusCodes.badRequest,
    message:
      "There is already a commercial license assigned to you which superseded the currently selected license type",
    expose: true,
  },
  internalServerError: {
    status: statusCodes.internalError,
    message: "An error occurred",
    expose: true,
  },
  emailNotSent: {
    status: statusCodes.internalError,
    message: "Email failed to send",
    expose: true,
  },
  forbiddenAccess: {
    status: statusCodes.forbidden,
    message: "Forbidden",
    expose: true,
  },
  notAuthenticated: {
    status: statusCodes.unauthorized,
    message: "Not authenticated",
    expose: true,
  },
  alreadyAuthenticated: {
    status: statusCodes.badRequest,
    message: "Already authenticated",
    expose: true,
  },
  notAuthorized: {
    status: statusCodes.forbidden,
    message: "Not authorized to request resource",
    expose: true,
  },
  routeParameterInvalid: {
    status: statusCodes.badRequest,
    message: "Invalid route parameter",
    expose: true,
  },
  routeQueryInvalid: {
    status: statusCodes.badRequest,
    message: "Invalid route query",
    expose: true,
  },
  aspectRatioInvalid: {
    status: statusCodes.badRequest,
    message: "File aspect ratio is not valid",
    expose: true,
  },
  fileDimensionsInvalid: {
    status: statusCodes.badRequest,
    message: "File dimensions are not valid",
    expose: true,
  },
  maxRequests: {
    status: statusCodes.tooManyRequests,
    message: "Too many requests",
    expose: true,
  },
};

export const responses = {
  artworkCreated: {
    status: statusCodes.ok,
    message: "Artwork published successfully",
    expose: true,
  },
  artworkUpdated: {
    status: statusCodes.ok,
    message: "Artwork updated successfully",
    expose: true,
  },
  artworkDeleted: {
    status: statusCodes.ok,
    message: "Artwork deleted successfully",
    expose: true,
  },
  artworkFavorited: {
    status: statusCodes.ok,
    message: "Artwork favorited successfully",
    expose: false,
  },
  artworkUnfavorited: {
    status: statusCodes.ok,
    message: "Artwork unfavorited successfully",
    expose: false,
  },
  userSignedUp: {
    status: statusCodes.ok,
    message: "Verify your email address",
    expose: true,
  },
  accessTokenRevoked: {
    status: statusCodes.ok,
    message: "Token successfully revoked",
    expose: false,
  },
  registerTokenVerified: {
    status: statusCodes.ok,
    message: "Token successfully verified",
    expose: true,
  },
  passwordUpdated: {
    status: statusCodes.ok,
    message: "Password updated successfully",
    expose: true,
  },
  passwordReset: {
    status: statusCodes.ok,
    message: "Reset link sent if the email is valid",
    expose: true,
  },
  verificationTokenResent: {
    status: statusCodes.ok,
    message: "Verification link sent if the email is valid",
    expose: true,
  },
  emailAddressUpdated: {
    status: statusCodes.ok,
    message: "Verification link sent if the email is available",
    expose: true,
  },
  orderCreated: {
    status: statusCodes.ok,
    message: "Order completed successfully",
    expose: true,
  },
  commentCreated: {
    status: statusCodes.ok,
    message: "Comment posted successfully",
    expose: true,
  },
  commentUpdated: {
    status: statusCodes.ok,
    message: "Comment updated successfully",
    expose: true,
  },
  commentDeleted: {
    status: statusCodes.ok,
    message: "Comment deleted successfully",
    expose: true,
  },
  discountApplied: {
    status: statusCodes.ok,
    message: "Discount applied",
    expose: true,
  },
  notificationRead: {
    status: statusCodes.ok,
    message: "Notification read",
    expose: false,
  },
  notificationUnread: {
    status: statusCodes.ok,
    message: "Notification unread",
    expose: false,
  },
  notificationsDeleted: {
    status: statusCodes.ok,
    message: "Notifications deleted successfully",
    expose: false,
  },
  reviewCreated: {
    status: statusCodes.ok,
    message: "Review successfully published",
    expose: true,
  },
  eventReceived: {
    status: statusCodes.ok,
    message: "Webhook event received",
    expose: false,
  },
  payoutCreated: {
    status: statusCodes.ok,
    message: "Payout successfully created",
    expose: true,
  },
  paymentProcessed: {
    status: statusCodes.ok,
    message: "Order processed successfully",
    expose: true,
  },
  userDetailsUpdated: {
    status: statusCodes.ok,
    message: "User details updated",
    expose: true,
  },
  userIntentCreated: {
    status: statusCodes.ok,
    message: "Intent successfully saved",
    expose: false,
  },
  userIntentDeleted: {
    status: statusCodes.ok,
    message: "Intent successfully deleted",
    expose: false,
  },
  passwordUpdated: {
    status: statusCodes.ok,
    message: "Password updated successfully",
    expose: true,
  },
  preferencesUpdated: {
    status: statusCodes.ok,
    message: "Preferences updated successfully",
    expose: true,
  },
  userDeactivated: {
    status: statusCodes.ok,
    message: "User account deactivated",
    expose: true,
  },
  stripeOnboardingSuccessful: {
    status: statusCodes.ok,
    message: "Onboarding successful",
    expose: true,
  },
};
