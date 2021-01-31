import { Box, Typography } from "@material-ui/core";
import { AutorenewRounded as RefetchIcon } from "@material-ui/icons";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import AsyncButton from "../AsyncButton";

const InfiniteList = ({
  style,
  className,
  dataLength,
  next,
  hasMore,
  loading,
  loader,
  error,
  children,
}) => {
  console.log("PROPS", dataLength, next, hasMore, loading, loader, error);
  return (
    <InfiniteScroll
      style={style}
      className={className}
      dataLength={dataLength}
      next={!loading ? next : () => []}
      hasMore={hasMore}
      loader={!error && loader}
    >
      {children}
      {error && (
        <Box>
          <Typography>Error fetching data</Typography>
          <AsyncButton
            type="button"
            variant="outlined"
            color="primary"
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
