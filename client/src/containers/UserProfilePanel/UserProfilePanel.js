import React from 'react';
import { Grid, Paper, Divider } from '@material-ui/core';
import ProfileCard from '../../components/ProfileCard/ProfileCard.js';
import ProfileShare from '../../components/ProfileShare/ProfileShare.js';

const UserProfilePanel = ({ user, handleModalOpen }) => {
  return (
    <Grid item xs={12} md={4}>
      <Paper>
        <ProfileCard user={user} handleModalOpen={handleModalOpen} />
        <Divider />
        <ProfileShare />
      </Paper>
    </Grid>
  );
};

export default UserProfilePanel;