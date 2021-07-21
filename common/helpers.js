import currency from "currency.js";
import * as fns from "date-fns";
import createError from "http-errors";
import { formatError } from "../utils/helpers";
import { errors } from "../utils/statuses";
import { featureFlags } from "./constants";
const { format } = fns;

export const formatDate = (date, form = "dd/MM/yy HH:mm") => {
  return format(new Date(date), form);
};

export const formatAmount = (value) => {
  return currency(value).divide(100);
};

export const rgbToHex = (r, g, b) =>
  "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const isArrayEmpty = (array) => {
  return !array.length;
};

export const isObjectEmpty = (object) => {
  for (let item in object) {
    if (object.hasOwnProperty(item)) return false;
  }
  return true;
};

export const isPositiveInteger = (value) => {
  const convertedValue = parseInt(value);
  return (
    convertedValue !== NaN &&
    Number.isInteger(convertedValue) &&
    convertedValue > 0
  );
};

export const verifyVersionValidity = async ({
  data,
  foundUser,
  foundAccount,
}) => {
  if (data.artworkPersonal || data.artworkCommercial) {
    // FEATURE FLAG - stripe
    if (!featureFlags.stripe) {
      throw createError(...formatError(errors.commercialArtworkUnavailable));
    }
    if (!foundUser.stripeId)
      throw createError(...formatError(errors.stripeOnboardingIncomplete));
    if (
      (data.artworkPersonal || data.artworkCommercial) &&
      (!foundAccount ||
        foundAccount.capabilities.card_payments !== "active" ||
        foundAccount.capabilities.transfers !== "active")
    ) {
      throw createError(...formatError(errors.stripeAccountIncomplete));
    }
  }
  return;
};

export const isFormAltered = (currentValues, defaultValues) => {
  for (let item in currentValues) {
    if (defaultValues[item] !== currentValues[item]) {
      return true;
    }
  }
  return false;
};

export const renderFreeLicenses = ({ version }) => {
  return [
    ...(version.type === "free" && version.use !== "included"
      ? [
          {
            value: "personal",
            text: "Personal",
          },
        ]
      : []),

    ...(version.type === "free" && version.use === "included"
      ? [
          {
            value: "commercial",
            text: "Commercial",
          },
        ]
      : []),
  ];
};

export const renderCommercialLicenses = ({ version }) => {
  return [
    ...(version.type === "commercial" && version.use !== "included"
      ? [
          {
            value: "personal",
            text: "Personal",
          },
        ]
      : []),

    ...((version.license === "commercial" && version.use === "separate") ||
    (version.type === "commercial" && version.use === "included")
      ? [
          {
            value: "commercial",
            text: "Commercial",
          },
        ]
      : []),
  ];
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
    artworkPersonal:
      data.artworkAvailability === "available" &&
      data.artworkType === "commercial"
        ? data.artworkPersonal
        : 0,
    artworkUse:
      data.artworkAvailability === "available" &&
      data.artworkLicense === "commercial"
        ? data.artworkUse
        : "unavailable",
    artworkCommercial:
      data.artworkAvailability === "available" &&
      data.artworkLicense === "commercial"
        ? data.artworkUse === "separate"
          ? data.artworkCommercial
          : data.artworkPersonal
        : 0,
    // $TODO restore after tags are implemented
    // artworkTags: JSON.parse(data.artworkTags),
  };
};
