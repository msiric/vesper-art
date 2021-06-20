import React from "react";
import { errors } from "../../../common/constants";
import Redirect from "../pages/Home/Redirect";
import Retry from "../pages/Home/Retry";

export const deleteEmptyValues = (values) => {
  for (let value in values) {
    if (typeof values[value] !== "boolean" && !values[value])
      delete values[value];
  }
  return values;
};

export const formatArtworkValues = (data) => {
  return {
    ...data,
    // artworkType
    // if artworkAvailability === 'available'
    // then either 'free' or 'commercial'
    // else 'unavailable'

    // artworkLicense
    // if artworkAvailability === 'available'
    // then either 'personal' or 'commercial'
    // else 'unavailable'

    // artworkUse
    // if artworkAvailability === 'available' and artworkLicense === 'commercial'
    // then either 'separate' or 'included'
    // else 'unavailable'

    artworkType:
      data.artworkAvailability === "available"
        ? data.artworkType
        : "unavailable",
    artworkLicense:
      data.artworkAvailability === "available"
        ? data.artworkLicense
        : "unavailable",
    artworkUse:
      data.artworkAvailability === "available" &&
      data.artworkLicense === "commercial"
        ? data.artworkUse
        : "unavailable",
    artworkPersonal:
      data.artworkAvailability === "available" &&
      data.artworkType === "commercial"
        ? data.artworkUse === "separate" || data.artworkLicense === "personal"
          ? data.artworkPersonal
          : 0
        : 0,
    artworkCommercial:
      data.artworkLicense === "commercial"
        ? data.artworkAvailability === "available" &&
          data.artworkLicense === "commercial" &&
          data.artworkUse === "separate"
          ? data.artworkCommercial + data.artworkPersonal
          : data.artworkPersonal
        : 0,
    // $TODO restore after tags are implemented
    // artworkTags: JSON.parse(data.artworkTags),
  };
};

export const resolvePaginationId = (data) => {
  return data[data.length - 1] && data[data.length - 1].id;
};

export const resolveAsyncError = (err, isInfinite = false) => {
  const statusCode = err.response.data.status_code;
  const notFound = statusCode === errors.notFound;
  const errorObj = isInfinite
    ? { refetch: true, message: "" }
    : notFound
    ? { redirect: true, message: "" }
    : { retry: true, message: "" };
  return errorObj;
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
      return <Retry message={error.message} />;
    }
    if (error.redirect) {
      return <Redirect message={error.message} />;
    }
  }
};
