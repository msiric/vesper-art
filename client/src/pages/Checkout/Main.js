import { Box, CircularProgress, Container, Paper } from '@material-ui/core';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import Steppers from './Steppers.js';

const Main = ({}) => {
  const [state, setState] = useState({ loading: true, stripe: null });

  const fetchStripePromise = async () => {
    try {
      const stripe = await loadStripe(
        'pk_test_xi0qpLTPs3WI8YPUfTyeeyzt00tNwou20z'
      );
      setState({
        ...state,
        stripe: stripe,
        loading: false,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchStripePromise();
  }, []);

  return (
    <Box component="main">
      <Container maxWidth="md">
        {state.loading ? (
          <CircularProgress />
        ) : (
          <Paper elevation={5}>
            {state.stripe ? (
              <Elements stripe={state.stripe}>
                <Steppers />
              </Elements>
            ) : null}
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Main;
