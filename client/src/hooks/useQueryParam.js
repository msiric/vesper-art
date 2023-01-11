import { useEffect, useRef } from "react";

export const useQueryParam = (
  paramName,
  value,
  initialValue,
  supportedValues,
  setValue
) => {
  const initialized = useRef(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlValue = queryParams.get(paramName);
    if (urlValue !== value) {
      const isValidParameter =
        urlValue !== null && supportedValues.some((item) => item == urlValue); // no strict equality (===) to make the conversion from/to string/integer
      setValue(isValidParameter ? urlValue : initialValue);
    }
  }, [JSON.stringify(supportedValues)]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlValue = queryParams.get(paramName);
    const strippedUrl = window.location.href.split(/[?#]/)[0];

    if (!urlValue || (urlValue !== value && initialized.current)) {
      if (queryParams.get(paramName)) {
        queryParams.set(paramName, value);
      } else {
        queryParams.append(paramName, value);
      }
      window.history.replaceState("", "", `${strippedUrl}?${queryParams}`);
    }
    initialized.current = true;
  }, [value, paramName]);
};
