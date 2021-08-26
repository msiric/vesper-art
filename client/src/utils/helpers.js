import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { featureFlags, statusCodes } from "../../../common/constants";
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
  console.log(err);
  console.log(err.response);
  if (err && err.response) {
    const statusCode = err.response.data.status;
    const notFound = statusCode === statusCodes.notFound;
    const errorObj = isInfinite
      ? { refetch: true, message: "" }
      : notFound
      ? { redirect: true, message: "" }
      : { retry: true, message: "" };
    return errorObj;
  }
  return;
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
