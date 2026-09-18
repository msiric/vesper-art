import { AutorenewRounded as RefetchIcon } from "@material-ui/icons";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Box from "../../domain/Box";
import Typography from "../../domain/Typography";
import AsyncButton from "../AsyncButton";
import EmptySection from "../EmptySection";
import infiniteListStyles from "./styles";

const InfiniteList = ({
  dataLength,
  next,
  hasMore,
  loading,
  fetching,
  initialized,
  error,
  label,
  height,
  emptyHeight,
  shouldPause = false,
  overflow = "visible !important",
  children,
  ...props
}) => {
  const classes = infiniteListStyles({ overflow, dataLength, emptyHeight });

  const showEmptySection =
    initialized && !loading && !fetching && !dataLength && !error;
  const showLoadMore =
    initialized && !loading && !fetching && !error && hasMore;

  return (
    <InfiniteScroll
      height={height}
      dataLength={dataLength}
      next={!loading && !fetching ? next : () => []}
      hasMore={!shouldPause && hasMore}
      className={classes.container}
      {...props}
    >
      {children}
      {showEmptySection && <EmptySection label={label} height={emptyHeight} />}
      {showLoadMore && (
        <AsyncButton
          type="button"
          padding
          startIcon={<RefetchIcon />}
          onClick={next}
        >
          Load more
        </AsyncButton>
      )}
      {error && (
        <Box className={classes.error}>
          <Typography className={classes.label}>Error fetching data</Typography>
          <AsyncButton type="button" startIcon={<RefetchIcon />} onClick={next}>
            Retry
          </AsyncButton>
        </Box>
      )}
    </InfiniteScroll>
  );
};

export default InfiniteList;
