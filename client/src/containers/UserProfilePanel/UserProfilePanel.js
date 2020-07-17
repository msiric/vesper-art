import React from "react";
import { Grid, Paper } from "@material-ui/core";
import ProfileCard from "../../components/ProfileCard/ProfileCard.js";
import ProfileShare from "../../components/ProfileShare/ProfileShare.js";

const UserProfilePanel = ({ user }) => {
  return (
    <Grid item xs={12} md={4}>
      <Paper>
        <ProfileCard user={user} />
        <ProfileShare />
      </Paper>
    </Grid>
  );
};

export default UserProfilePanel;
