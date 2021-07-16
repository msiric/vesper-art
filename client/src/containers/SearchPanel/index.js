import React, { useEffect } from "react";
import Masonry from "react-masonry-css";
import { useLocation } from "react-router-dom";
import ArtworkCard from "../../components/ArtworkCard/index";
import InfiniteList from "../../components/InfiniteList/index";
import ProfileCard from "../../components/ProfileCard/index";
import { useSearchResults } from "../../contexts/local/searchResults";
import Box from "../../domain/Box";
import searchPanelStyles from "./styles";

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const SearchPanel = ({ type }) => {
  const elements = useSearchResults((state) => state[type].data);
  const hasMore = useSearchResults((state) => state[type].hasMore);
  const loading = useSearchResults((state) => state[type].loading);
  const fetching = useSearchResults((state) => state[type].fetching);
  const error = useSearchResults((state) => state[type].error);
  const fetchResults = useSearchResults((state) => state.fetchResults);

  const location = useLocation();

  const classes = searchPanelStyles();

  useEffect(() => {
    fetchResults({ query: location.search, type });
  }, []);

  return (
    <Box className={classes.container}>
      <InfiniteList
        dataLength={elements ? elements.length : 0}
        next={fetchResults}
        hasMore={hasMore}
        loading={loading}
        fetching={fetching}
        error={error.refetch}
        empty="No results matched your query"
        type="masonry"
      >
        <Masonry
          breakpointCols={breakpointColumns}
          className={classes.masonry}
          columnClassName={classes.column}
        >
          {elements.map((element) =>
            type === "artwork" ? (
              <ArtworkCard artwork={element} type="artwork" />
            ) : (
              <ProfileCard user={element} loading={false} />
            )
          )}
        </Masonry>
      </InfiniteList>
    </Box>
  );
};

export default SearchPanel;
