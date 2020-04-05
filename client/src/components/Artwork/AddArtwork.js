import React, { useContext } from 'react';
import { Context } from '../Store/Store';
import { Grid } from '@material-ui/core';
import AddArtworkStyles from './AddArtwork.style';

const AddArtwork = () => {
  const [state, dispatch] = useContext(Context);

  const classes = AddArtworkStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}></Grid>
    </Grid>
  );
};

export default AddArtwork;
