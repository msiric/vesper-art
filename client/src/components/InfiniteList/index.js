import { AutorenewRounded as RefetchIcon } from "@material-ui/icons";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Box from "../../domain/Box";
import LinearProgress from "../../domain/LinearProgress";
import Typography from "../../domain/Typography";
import AsyncButton from "../AsyncButton";
import EmptySection from "../EmptySection";
import LoadingSpinner from "../LoadingSpinner";
import infiniteListStyles from "./styles";

const InfiniteList = ({
  style,
  className,
  dataLength,
  next,
  hasMore,
  loading,
  fetching,
  initialized,
  error,
  empty,
  height,
  type,
  customPadding,
  shouldPause = false,
  overflow = "visible !important",
  children,
  ...props
}) => {
  const classes = infiniteListStyles({ overflow });

  const showEmptySection =
    initialized && !loading && !fetching && !dataLength && !error;
  const showLoadMore =
    initialized && !loading && !fetching && !error && hasMore;
  const showLinearProgress = type === "masonry" && loading;

  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={!loading && !fetching ? next : () => []}
      hasMore={!shouldPause && hasMore}
      loader={
        !error && (
          <LoadingSpinner
            styles={!customPadding && classes.spinner}
            customPadding={customPadding}
          />
        )
      }
      className={classes.wrapper}
      height={height}
      {...props}
    >
      {children}
      {showLinearProgress && <LinearProgress />}
      {showEmptySection && <EmptySection label={empty} />}
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
          <Typography>Error fetching data</Typography>
          <AsyncButton
            type="button"
            padding
            startIcon={<RefetchIcon />}
            onClick={next}
          >
            Retry
          </AsyncButton>
        </Box>
      )}
    </InfiniteScroll>
  );
};

export default InfiniteList;
