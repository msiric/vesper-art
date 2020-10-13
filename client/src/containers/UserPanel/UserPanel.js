import { Fade, Grid, Paper } from "@material-ui/core";
import React, { useContext, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import ProfileCard from "../../components/ProfileCard/ProfileCard.js";
import { Context } from "../../context/Store.js";

const UserPanel = ({ elements, hasMore, loadMore, enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({});

  const classes = {};

  return (
    <Paper className={classes.paper}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={elements.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <Grid item xs={12} className={classes.loader}>
            <LoadingSpinner />
          </Grid>
        }
      >
        <Grid container className={classes.container}>
          {elements.map((element, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: 300,
                height: "100%",
              }}
            >
              <Fade in>
                <ProfileCard user={element} loading={false} />
              </Fade>
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Paper>
  );
};

export default UserPanel;
