import { determineFetchingState, determineLoadingState } from "@utils/helpers";
import React, { useEffect } from "react";
import Masonry from "react-masonry-css";
import { useLocation } from "react-router-dom";
import ArtworkCard from "../../components/ArtworkCard/index";
import InfiniteList from "../../components/InfiniteList/index";
import ProfileCard from "../../components/ProfileCard/index";
import { useSearchResults } from "../../contexts/local/searchResults";
import Box from "../../domain/Box";
import { breakpointsFullWidth } from "../../shared/constants";
import searchPanelStyles from "./styles";

const SearchPanel = ({ type }) => {
  const elements = useSearchResults((state) => state[type].data);
  const initialized = useSearchResults((state) => state[type].initialized);
  const hasMore = useSearchResults((state) => state[type].hasMore);
  const loading = useSearchResults((state) => state[type].loading);
  const limit = useSearchResults((state) => state[type].limit);
  const fetching = useSearchResults((state) => state[type].fetching);
  const error = useSearchResults((state) => state[type].error);
  const fetchResults = useSearchResults((state) => state.fetchResults);

  const location = useLocation();

  const classes = searchPanelStyles();

  const renderItem = (element, loading) =>
    type === "artwork" ? (
      <ArtworkCard artwork={element} type="artwork" loading={loading} />
    ) : (
      <ProfileCard user={element} loading={loading} />
    );

  useEffect(() => {
    fetchResults({ query: location.search, type });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, type]);

  return (
    <Box className={classes.container}>
      <InfiniteList
        dataLength={elements ? elements.length : 0}
        next={fetchResults}
        hasMore={hasMore}
        loading={loading}
        fetching={fetching}
        initialized={initialized}
        error={error.refetch}
        label="No results matched your query"
        type="masonry"
        emptyHeight={750}
      >
        <Masonry
          breakpointCols={breakpointsFullWidth}
          className={classes.masonry}
          columnClassName={classes.column}
        >
          {determineLoadingState(loading, limit, elements).map((element) =>
            renderItem(element, loading)
          )}
          {determineFetchingState(fetching, limit).map((element) =>
            renderItem(element, fetching)
          )}
        </Masonry>
      </InfiniteList>
    </Box>
  );
};

export default SearchPanel;
