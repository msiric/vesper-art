import { AutorenewRounded as RefetchIcon } from "@material-ui/icons";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Box from "../../domain/Box";
import Typography from "../../domain/Typography";
import AsyncButton from "../AsyncButton";
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
  children,
  ...props
}) => {
  const classes = infiniteListStyles();

  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={!loading ? next : () => []}
      hasMore={hasMore}
      loader={!error && <LoadingSpinner styles={{ marginTop: 20 }} />}
      className={classes.wrapper}
      {...props}
    >
      {children}
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
