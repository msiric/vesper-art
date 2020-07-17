import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import ProfileBanner from "../../components/ProfileBanner/ProfileBanner.js";

const useStyles = makeStyles({
  profile__bannerContainer: {},
});

const UserProfileBanner = () => {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.profile__bannerContainer}>
      <ProfileBanner />
    </Grid>
  );
};

export default UserProfileBanner;
