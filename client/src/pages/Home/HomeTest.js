import { Grid } from "@material-ui/core";
import { withSnackbar } from "notistack";
import React from "react";
import ArtworkPanel from "../../containers/ArtworkPanel/index.js";
import HomeBanner from "../../containers/HomeBanner";

const Home = () => {
  return [
    <Grid
      container
      style={{ width: "100%", margin: 0, padding: "0 32px" }}
      spacing={3}
    >
      <HomeBanner />
    </Grid>,
    <Grid
      container
      style={{ width: "100%", margin: 0, padding: "0 32px" }}
      spacing={3}
    >
      <Grid item xs={12} style={{ marginTop: 32 }}>
        <ArtworkPanel type="artwork" />
      </Grid>
    </Grid>,
  ];
};

export default withSnackbar(Home);
