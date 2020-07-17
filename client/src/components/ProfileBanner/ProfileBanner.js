import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles({
  profile__banner: {
    height: 200,
    backgroundColor: "gray",
  },
});

const ProfileBanner = () => {
  const classes = useStyles();

  return <Paper className={classes.profile__banner}></Paper>;
};

export default ProfileBanner;
