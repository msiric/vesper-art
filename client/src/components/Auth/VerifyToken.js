import React, { useEffect } from 'react';
import { Container, Grid, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { ax } from '../../shared/Interceptor/Interceptor.js';
import VerifyTokenStyles from './VerifyToken.style.js';

const VerifyToken = ({ match }) => {
  const history = useHistory();
  const classes = VerifyTokenStyles();

  const verifyToken = async () => {
    try {
      await ax.get(`/api/auth/verify_token/${match.params.id}`);
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

export default VerifyToken;
