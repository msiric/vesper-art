import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import ArtworkPanel from "../../containers/ArtworkPanel/index";
import HomeBanner from "../../containers/HomeBanner";
import { useHomeArtwork } from "../../contexts/local/homeArtwork";
import Grid from "../../domain/Grid";

const useHomeStyles = makeStyles((muiTheme) => ({
  wrapper: {
    width: "100%",
    margin: 0,
  },
  artworkWrapper: {
    marginTop: 32,
  },
}));

const Home = () => {
  const resetArtwork = useHomeArtwork((state) => state.resetArtwork);

  const classes = useHomeStyles();

  const reinitializeState = () => {
    resetArtwork();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return [
    <Grid container className={classes.wrapper} spacing={3}>
      <HomeBanner />
    </Grid>,
    <Grid container className={classes.wrapper} spacing={3}>
      <Grid item xs={12} className={classes.artworkWrapper}>
        <ArtworkPanel type="artwork" />
      </Grid>
    </Grid>,
  ];
};

export default Home;
