import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ProfileBanner from '../../components/ProfileBanner/ProfileBanner.js';
import ProfileCard from '../../components/ProfileCard/ProfileCard.js';
import ProfileShare from '../../components/ProfileShare/ProfileShare.js';

const useStyles = makeStyles({
  profile__bannerContainer: {},
});

const UserProfileBanner = ({ user, handleModalOpen }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.profile__bannerContainer}>
      <ProfileBanner user={user} handleModalOpen={handleModalOpen} />
    </Grid>
  );
};

export default UserProfileBanner;
