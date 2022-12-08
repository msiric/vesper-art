import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import ArtworkPanel from "../../containers/ArtworkPanel/index";
import HomeBanner from "../../containers/HomeBanner";
import { useHomeArtwork } from "../../contexts/local/homeArtwork";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";

const useHomeStyles = makeStyles(() => ({
  banner: {
    marginBottom: 0,
    paddingBottom: 0,
  },
}));

const Home = () => {
  const resetArtwork = useHomeArtwork((state) => state.resetArtwork);

  const globalClasses = globalStyles();
  const classes = useHomeStyles();

  const reinitializeState = () => {
    resetArtwork();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid
        className={`${globalClasses.largeContainer} ${globalClasses.gridContainer} ${classes.banner}`}
      >
        <Grid container spacing={2}>
          <HomeBanner />
        </Grid>
      </Grid>
      <Grid
        className={`${globalClasses.largeContainer} ${globalClasses.gridContainer}`}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.artworkWrapper}>
            <ArtworkPanel type="artwork" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
