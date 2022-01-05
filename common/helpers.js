import currency from "currency.js";
import * as fns from "date-fns";
import abbreviate from "number-abbreviate";
const { format } = fns;

export const licenseErrors = {
  companyError: {
    message: "There is already a license assigned to the provided company",
    identifier: "licenseCompanyExists",
  },
  identicalError: {
    message: "There is already an identical license assigned to you",
    identifier: "licenseAlreadyExists",
  },
  supersededError: {
    message:
      "There is already a commercial license assigned to you which supersedes the currently selected license type",
    identifier: "licenseTypeSuperseded",
  },
};

export const trimAllSpaces = (value) =>
  typeof value === "string"
    ? value.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ")
    : value;

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

export const isLicenseValid = ({ data, orders }) => {
  const filteredUsage = orders.filter(
    (order) => order.license.usage === data.licenseUsage
  );
  if (filteredUsage.length) {
    if (data.licenseUsage === "business") {
      const filteredCompany = filteredUsage.filter(
        (order) => order.license.company === trimAllSpaces(data.licenseCompany)
      );
      if (!filteredCompany.length) {
        return {
          valid: true,
          state: { message: "", identifier: "" },
          ref: {},
        };
      }
      return {
        valid: false,
        state: licenseErrors.companyError,
        ref: filteredCompany[0] || {},
      };
    }
    const filteredType = filteredUsage.filter(
      (order) => order.license.type === data.licenseType
    );
    if (filteredType.length) {
      return {
        valid: false,
        state: licenseErrors.identicalError,
        ref: filteredType[0] || {},
      };
    }
    if (data.licenseType !== "commercial") {
      return {
        valid: false,
        state: licenseErrors.supersededError,
        ref: filteredType[0] || {},
      };
    }
    return { valid: true, state: { message: "", identifier: "" }, ref: {} };
  }
  return { valid: true, state: { message: "", identifier: "" }, ref: {} };
};

export const isFormAltered = (currentValues, defaultValues, mapper = null) => {
  for (let item in currentValues) {
    if (mapper) {
      if (currentValues[item] !== defaultValues[mapper[item]]) {
        return true;
      }
    } else {
      if (currentValues[item] !== defaultValues[item]) {
        return true;
      }
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

export const formatLicenseValues = (data) => {
  return {
    ...data,
    licenseCompany:
      data.licenseUsage === "business" ? data.licenseCompany : "unavailable",
  };
};

export const formatMimeTypes = (values) => {
  const mimeTypes = Object.keys(values);
  return mimeTypes
    .map((item, index) =>
      index === mimeTypes.length - 1
        ? `${values[item].label}.`
        : `${values[item].label}, `
    )
    .join("");
};

export const formatArtworkPrice = ({
  price,
  prefix = "$",
  freeFormat = "Free",
  withPrecision = false,
  withAbbreviation = false,
}) =>
  price && price > 0
    ? withAbbreviation
      ? `${prefix}${abbreviate(price, 2)}`
      : `${prefix}${currency(price, {
          separator: ",",
          precision: withPrecision ? 2 : 0,
        }).format()}`
    : freeFormat;
