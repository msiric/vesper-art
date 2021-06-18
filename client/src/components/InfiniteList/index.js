import { AutorenewRounded as RefetchIcon } from "@material-ui/icons";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Box from "../../domain/Box";
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
  error,
  empty,
  height,
  children,
  ...props
}) => {
  const classes = infiniteListStyles({ height });

  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={!loading ? next : () => []}
      hasMore={hasMore}
      loader={!error && <LoadingSpinner styles={classes.spinner} />}
      className={classes.wrapper}
      height={height}
      {...props}
    >
      {children}
      {!loading && !dataLength ? <EmptySection label={empty} /> : null}
      {error && (
        <Box className={classes.error}>
          <Typography>Error fetching data</Typography>
          <AsyncButton
            type="button"
            padding
            loading={false}
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
