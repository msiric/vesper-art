export const deleteEmptyValues = (values) => {
  for (let value in values) {
    if (typeof values[value] !== "boolean" && !values[value])
      delete values[value];
  }
  return values;
};

export const formatValues = (data) => {
  return {
    ...data,
    artworkType:
      data.artworkAvailability === "available" ? data.artworkType : "",
    artworkLicense:
      data.artworkAvailability === "available" ? data.artworkLicense : "",
    artworkPersonal:
      data.artworkAvailability === "available" &&
      data.artworkType === "commercial"
        ? data.artworkPersonal
        : "",
    artworkUse:
      data.artworkAvailability === "available" &&
      data.artworkLicense === "commercial"
        ? data.artworkUse
        : "",
    artworkCommercial:
      data.artworkAvailability === "available" &&
      data.artworkLicense === "commercial" &&
      data.artworkUse === "separate"
        ? data.artworkCommercial
        : "",
  };
};

export const resolvePaginationId = (data) => {
  return data[data.length - 1] && data[data.length - 1].id;
};

export const displayValidLicense = (use, license) => {
  return use !== "included"
    ? "personal"
    : license === "commercial"
    ? "commercial"
    : null;
};
