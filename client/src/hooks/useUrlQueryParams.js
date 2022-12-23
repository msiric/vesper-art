import qs from "qs";
import { useCallback, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export const useQueryState = (queryParams) => {
  const location = useLocation();
  const history = useHistory();

  const setQuery = useCallback(
    (params) => {
      const existingQueries = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });

      if (JSON.stringify(existingQueries) !== JSON.stringify(params)) {
        const queryString = qs.stringify(
          { ...existingQueries, ...params },
          { skipNulls: true }
        );

        history.push(`${location.pathname}?${queryString}`);
      }
    },
    [history, location, queryParams]
  );

  useEffect(() => {
    setQuery(queryParams);
  }, [queryParams]);

  return [qs.parse(location.search, { ignoreQueryPrefix: true })[queryParams]];
};
