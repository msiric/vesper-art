import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import { useLocation } from "react-router-dom";
import ArtworkCard from "../../components/ArtworkCard/index.js";
import EmptySection from "../../components/EmptySection/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import ProfileCard from "../../components/ProfileCard/index.js";
import { useSearchResults } from "../../contexts/local/searchResults";
import searchPanelStyles from "./styles.js";

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const SearchPanel = ({ type }) => {
  const elements = useSearchResults((state) => state[type].data);
  const loadMore = useSearchResults((state) => state[type].loadMore);
  const hasMore = useSearchResults((state) => state[type].hasMore);
  const loading = useSearchResults((state) => state[type].loading);

  const fetchResults = useSearchResults((state) => state.fetchResults);

  const location = useLocation();

  const classes = searchPanelStyles();

  useEffect(() => {
    fetchResults({ query: location.search, type });
  }, []);

  return (
    <Box style={{ width: "100%", height: "100%", padding: "16px 0" }}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={elements.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {elements.length ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className={classes.masonryContainer}
            columnClassName={classes.masonryColumn}
          >
            {elements.map((element) =>
              type === "artwork" ? (
                <ArtworkCard artwork={element} type="artwork" />
              ) : (
                <ProfileCard user={element} loading={false} />
              )
            )}
          </Masonry>
        ) : (
          <EmptySection
            label="No results matched your query"
            loading={loading}
          />
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default SearchPanel;
