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
  error,
  empty,
  height,
  type,
  customPadding,
  children,
  ...props
}) => {
  const classes = infiniteListStyles();

  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={!loading && !fetching ? next : () => []}
      hasMore={hasMore}
      loader={!error && <LoadingSpinner customPadding={customPadding} />}
      className={classes.wrapper}
      height={height}
      {...props}
    >
      {type === "masonry" && loading && <LinearProgress />}
      {children}
      {!loading && !fetching && !dataLength && !error ? (
        <EmptySection label={empty} />
      ) : null}
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
