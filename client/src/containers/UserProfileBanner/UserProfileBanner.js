import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import ProfileBanner from "../../components/ProfileBanner/ProfileBanner.js";

const useStyles = makeStyles({
  profile__bannerContainer: {},
});

const UserProfileBanner = ({ user, handleModalOpen, loading }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.profile__bannerContainer}>
      <ProfileBanner
        user={user}
        handleModalOpen={handleModalOpen}
        loading={loading}
      />
    </Grid>
  );
};

export default UserProfileBanner;
