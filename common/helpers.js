import currency from "currency.js";
import * as fns from "date-fns";
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

export const isVersionDifferent = (currentValues, savedValues) => {
  const mapper = {
    artworkTitle: "title",
    artworkType: "type",
    artworkAvailability: "availability",
    artworkLicense: "license",
    artworkUse: "use",
    artworkPersonal: "personal",
    artworkCommercial: "commercial",
    artworkDescription: "description",
    artworkVisibility: "visibility",
  };
  for (let item of Object.keys(currentValues)) {
    if (savedValues[mapper[item]] !== currentValues[item]) {
      return true;
    }
  }
  return false;
};

export const renderFreeLicenses = ({ version }) => {
  return [
    ...(version.type === "free" && version.use === "separate"
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
    ...(version.type === "commercial" && version.license === "personal"
      ? [
          {
            value: "personal",
            text: "Personal",
          },
        ]
      : []),

    ...(version.license === "commercial" && version.use === "separate"
      ? [
          {
            value: "commercial",
            text: "Commercial",
          },
        ]
      : []),
  ];
};
