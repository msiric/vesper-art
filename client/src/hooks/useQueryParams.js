import queryString from "query-string";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export const useQueryParams = (passedParams) => {
  const history = useHistory();
  const { search, pathname } = useLocation();

  const setQueryParams = (newParams) => {
    const existingParams = queryString.parse(search);
    if (JSON.stringify(existingParams) !== JSON.stringify(newParams)) {
      const updatedParams = { ...existingParams, ...newParams };
      history.push({ pathname, search: queryString.stringify(updatedParams) });
    }
  };

  useEffect(() => {
    setQueryParams(passedParams);
  }, [passedParams]);

  return [setQueryParams];
};
