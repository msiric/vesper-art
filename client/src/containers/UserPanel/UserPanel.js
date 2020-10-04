import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import { Context } from "../../context/Store.js";

const UserPanel = ({ elements, hasMore, loadMore, enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({});

  const classes = {};

  const users = elements.map((element, index) => {
    const card = (
      <Card key={index} className={classes.root}>
        <CardMedia
          component={Link}
          to={`/user/${element.name}`}
          className={classes.media}
          image={element.photo}
          title={element.name}
        />
        <CardContent>
          <Typography
            component={Link}
            to={`/user/${element.name}`}
            variant="body1"
            color="textSecondary"
            className={classes.link}
          >
            {element.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {element.country}
          </Typography>
        </CardContent>
      </Card>
    );

    return card;
  });

  return (
    <Paper className={classes.paper}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={users.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        }
      >
        <Masonry>{users}</Masonry>
      </InfiniteScroll>
    </Paper>
  );
};

export default UserPanel;
