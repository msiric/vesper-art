import HelpBox from "@components/HelpBox";
import Box from "@domain/Box";
import Typography from "@domain/Typography";
import { artepunktTheme } from "@styles/theme";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ALLOWED_ARTWORK_RATIO,
  auth,
  featureFlags,
  statusCodes,
  TRANSFORMED_ARTWORK_WIDTH,
} from "../../../common/constants";
import { isFormAltered } from "../../../common/helpers";
import Redirect from "../pages/Home/Redirect";
import Retry from "../pages/Home/Retry";

export const deleteEmptyValues = (values) => {
  for (const value in values) {
    if (
      typeof values[value] !== "boolean" &&
      isNaN(values[value]) &&
      !values[value]
    ) {
      delete values[value];
    }
  }
  return values;
};

export const resolvePaginationId = (data) => {
  return data[data.length - 1] && data[data.length - 1].id;
};

export const resolveAsyncError = (err, isInfinite = false) => {
  let errorType = "retry";
  if (err && err.response) {
    const statusCode = err.response.data.status;
    const notFound = statusCode === statusCodes.notFound;
    errorType = isInfinite ? "refetch" : notFound ? "redirect" : "retry";
  } else if (err && err.message) {
    const networkError = err.message === auth.networkMessage;
    errorType = isInfinite && networkError ? "refetch" : "retry";
  }
  return { [errorType]: true, message: "" };
};

export const displayValidLicense = (use, type) => {
  return type === "free"
    ? use !== "included"
      ? "personal"
      : "commercial"
    : null;
};

export const containsErrors = (...errors) => errors.some((error) => error);

export const renderError = (...errors) => {
  for (const error of errors) {
    if (error.retry) {
      return (
        <Retry
          message={error.message}
          reinitializeState={error.reinitializeState}
        />
      );
    }
    if (error.redirect) {
      return <Redirect message={error.message} />;
    }
  }
};

export const renderUserData = ({ data, isUsername = false, fallback = "/" }) =>
  data || (isUsername ? "[deleted]" : fallback);

export const renderRedirectLink = ({ active, isUsername = false }) =>
  active ? RouterLink : isUsername ? "p" : "div";

// FEATURE FLAG - payment
export const getBarState = () => ({
  // $TODO Temporary disabled banner
  // visible: !featureFlags.payment,
  visible: false,
  message: "Purchasing artwork is temporarily disabled",
});

// FEATURE FLAG (not really) - beta
export const getWrapperState = () => ({
  visible: true,
  message: "Beta",
});

export const capitalizeWord = ({ value }) =>
  value ? value[0].toUpperCase() + value.slice(1).toLowerCase() : value;

export const scrollToHighlight = (highlightRef) => {
  if (highlightRef.current)
    highlightRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
};

export const isFormDisabled = (currentValues, defaultValues, formState) => {
  const isFormInvalid = formState.isSubmitting;
  // || !formState.isValid;
  return !isFormAltered(currentValues, defaultValues) || isFormInvalid;
};

export const randomizeHeight = (minimum, maximum) => {
  const minimumHeight =
    minimum ?? (TRANSFORMED_ARTWORK_WIDTH - 400) / (ALLOWED_ARTWORK_RATIO / 3);
  const maximumHeight =
    maximum ?? (TRANSFORMED_ARTWORK_WIDTH - 350) * (ALLOWED_ARTWORK_RATIO / 3);
  return Math.floor(
    Math.random() * (maximumHeight - minimumHeight + 1) + minimumHeight
  );
};

export const determineLoadingState = (loading, count, elements) =>
  loading ? Array.from(Array(count).keys()) : elements;

export const determineFetchingState = (fetching, count) =>
  fetching ? Array.from(Array(count).keys()) : [];

export const renderTableBody = (value, loading, width = null) => {
  const { min, max } =
    width >= artepunktTheme.breakpoints.values.md
      ? { min: 60, max: 120 }
      : { min: 120, max: 280 };
  return !width ? (
    <Typography variant="subtitle2" loading={loading}>
      {value ?? "Loading"}
    </Typography>
  ) : (
    <Box height={randomizeHeight(min, max)} width="100%" loading={loading}>
      {value}
    </Box>
  );
};

export const displayOnboardingWarning = (
  loading,
  stripeId,
  onboarded,
  requirements
) => {
  // FEATURE FLAG - stripe
  const stripeDisabled =
    "Creating commercially available artwork is not yet available";
  const notOnboarded =
    'To make your artwork commercially available, click on "Become a seller" and complete the Stripe onboarding process';
  const pendingVerification =
    "To make your artwork commercially available, please wait for Stripe to verify the information you entered";
  const incompleteInformation =
    "To make your artwork commercially available, finish entering your Stripe account information";

  return !loading ? (
    !featureFlags.stripe ? (
      <HelpBox type="alert" label={stripeDisabled} />
    ) : !stripeId ? (
      <HelpBox type="alert" label={notOnboarded} />
    ) : requirements?.length ? (
      <HelpBox type="alert" label={pendingVerification} />
    ) : !onboarded ? (
      <HelpBox type="alert" label={incompleteInformation} />
    ) : null
  ) : null;
};
