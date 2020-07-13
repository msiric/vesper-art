import React, { useEffect } from 'react';
import { Container, Grid, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { getToken } from '../../services/auth.js';

const VerifyTokenLoader = ({ match }) => {
  const history = useHistory();
  const classes = {};

  const verifyToken = async () => {
    try {
      await getToken({ tokenId: match.params.id });
      history.push({
        pathname: '/login',
        state: { message: 'Email successfully verified' },
      });
    } catch (err) {
      history.push({
        pathname: '/',
        state: { message: 'An error occurred' },
      });
    }
  };

  useEffect(() => {
    verifyToken();
  });

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        <Grid item xs={12} className={classes.loader}>
          <CircularProgress />
        </Grid>
      </Grid>
    </Container>
  );
};

export default VerifyTokenLoader;
