import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { auth, featureFlags, statusCodes } from "../../../common/constants";
import { isFormAltered } from "../../../common/helpers";
import Redirect from "../pages/Home/Redirect";
import Retry from "../pages/Home/Retry";

export const deleteEmptyValues = (values) => {
  for (let value in values) {
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
  console.log("err", err);
  console.log("res", err.response);
  console.log("mes", err.message);

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
  for (let error of errors) {
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
  data ? data : isUsername ? "[deleted]" : fallback;

export const renderRedirectLink = ({ active, isUsername = false }) =>
  active ? RouterLink : isUsername ? "p" : "div";

// FEATURE FLAG - payment
export const getBarState = () => ({
  visible: !featureFlags.payment,
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
  const isFormInvalid = formState.isSubmitting || !formState.isValid;
  return !isFormAltered(currentValues, defaultValues) || isFormInvalid;
};
