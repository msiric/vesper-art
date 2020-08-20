import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Paper,
} from '@material-ui/core';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import CheckoutStepper from '../../containers/CheckoutStepper/CheckoutStepper.js';
import CheckoutSummary from '../../containers/CheckoutSummary/CheckoutSummary.js';
import { Context } from '../../context/Store.js';
import { getCheckout } from '../../services/checkout.js';

const validationSchema = Yup.object().shape({
  discountCode: Yup.string().trim().required('Discount cannot be empty'),
});

const Checkout = ({ match, location }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    stripe: null,
    secret: null,
    artwork: {},
    billing: {},
    license: null,
    discount: {},
    loading: true,
  });

  const history = useHistory();

  const classes = {};

  const handleSecretSave = (value) => {
    setState((prevState) => ({ ...prevState, secret: value }));
  };

  const handleLicenseChange = async (license) => {
    try {
      const versionId = state.artwork.current._id.toString();
      const storageObject = {
        versionId: versionId,
        intentId: null,
        licenseType: license,
      };
      window.sessionStorage.setItem(
        state.artwork._id,
        JSON.stringify(storageObject)
      );
      setState((prevState) => ({
        ...prevState,
        license: license,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleBillingSave = async (billing) => {
    setState((prevState) => ({
      ...prevState,
      billing: billing,
    }));
  };

  const handleDiscountEdit = (discount) => {
    setState((prevState) => ({
      ...prevState,
      discount: discount,
    }));
  };

  const retrieveLicenseInformation = (artwork) => {
    const checkoutItem = JSON.parse(
      window.sessionStorage.getItem(artwork._id.toString())
    );
    if (checkoutItem) {
      const currentId = artwork.current._id.toString();
      if (checkoutItem.versionId === currentId) {
        return checkoutItem.licenseType;
      } else {
        window.sessionStorage.removeItem(artwork._id);
        console.log('$TODO ENQUEUE MESSAGE, DELETE INTENT ON SERVER');
      }
    }
  };

  const fetchData = async () => {
    try {
      const billing = {
        firstname: '',
        lastname: '',
        email: '',
        address: '',
        zip: '',
        city: '',
        country: '',
      };
      const { data } = await getCheckout({ artworkId: match.params.id });
      const stripe = await loadStripe(
        'pk_test_xi0qpLTPs3WI8YPUfTyeeyzt00tNwou20z'
      );
      const licenses = retrieveLicenseInformation(data.artwork);
      setState({
        ...state,
        loading: false,
        stripe: stripe,
        artwork: data.artwork,
        license: location.state.license || null,
        billing: billing,
        discount: data.discount,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.artwork._id ? (
          <>
            <Grid item xs={12} md={8} className={classes.artwork}>
              <Box component="main">
                <Container maxWidth="md">
                  {state.loading ? (
                    <CircularProgress />
                  ) : (
                    <Paper elevation={5}>
                      {state.stripe ? (
                        <Elements stripe={state.stripe}>
                          <CheckoutStepper
                            secret={state.secret}
                            artwork={state.artwork}
                            license={state.license}
                            billing={state.billing}
                            discount={state.discount}
                            handleSecretSave={handleSecretSave}
                            handleLicenseChange={handleLicenseChange}
                            handleBillingSave={handleBillingSave}
                          />
                        </Elements>
                      ) : null}
                    </Paper>
                  )}
                </Container>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} className={classes.actions}>
              <CheckoutSummary
                artwork={state.artwork}
                license={state.license}
                discount={state.discount}
                handleDiscountEdit={handleDiscountEdit}
              />
              <br />
            </Grid>
          </>
        ) : (
          history.push('/')
        )}
      </Grid>
    </Container>
  );
};

export default Checkout;
