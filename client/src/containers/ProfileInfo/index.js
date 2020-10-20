import { Grid } from "@material-ui/core";
import React from "react";
import ProfileBanner from "../../components/ProfileBanner/ProfileBanner.js";
import profileInfoStyles from "./styles.js";

const ProfileInfo = ({ user, handleModalOpen, loading }) => {
  const classes = profileInfoStyles();

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

export default ProfileInfo;
