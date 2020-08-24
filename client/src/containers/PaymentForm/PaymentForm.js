import { Grid, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { withSnackbar } from 'notistack';
import React, { useImperativeHandle, useRef } from 'react'; //, {useState }
import { useHistory } from 'react-router-dom';

const PaymentFormStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
  },
  artwork: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  root: {
    display: 'flex',
    width: '100%',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  details: {
    display: 'flex',
    width: '100%',
  },
  cover: {
    minWidth: 50,
    maxWidth: 200,
    width: '100%',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
    width: '100%',
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  rightList: {
    textAlign: 'right',
  },
  manageLicenses: {
    padding: '8px 16px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const StripeInput = ({ component: Component, inputRef, ...other }) => {
  const elementRef = useRef();
  useImperativeHandle(inputRef, () => ({
    focus: () => elementRef.current.focus,
  }));

  return (
    <Component
      onReady={(element) => (elementRef.current = element)}
      {...other}
    />
  );
};

const PaymentForm = ({ secret, artwork }) => {
  const classes = PaymentFormStyles();

  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();

  const cardsLogo = [
    'amex',
    'cirrus',
    'diners',
    'dankort',
    'discover',
    'jcb',
    'maestro',
    'mastercard',
    'visa',
    'visaelectron',
  ];

  /*   const handlePaymentSubmit = async () => {
    if (!secret || !stripe || !elements) {
      // $TODO Enqueue error;
    }
    const cardElement = elements.getElement(CardNumberElement);
    const stripeData = {
      payment_method: {
        card: cardElement,
        billing_details: {
          address: {
            city: billing.city,
            country: billing.country.code,
            line1: billing.address,
            line2: null,
            postal_code: billing.zip,
            state: null,
          },
          email: billing.email,
          name: `${billing.firstname} ${billing.lastname}`,
          phone: null,
        },
      },
    };
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      secret,
      stripeData
    );

    if (error) {
      console.log('fail');
      console.log(error);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('success');
      enqueueSnackbar('Payment successful', {
        variant: 'success',
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      enqueueSnackbar('Your purchase will appear in the "orders" page soon', {
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
    }
  }; */

  return (
    <>
      <Grid container item xs={12}>
        <Grid item xs={12} sm={3}>
          <Typography variant="h6">Payment Data</Typography>
        </Grid>
        <Grid container item xs={12} sm={9} justify="space-between">
          {cardsLogo.map((e) => (
            <img
              key={e}
              src={`../cards/${e}.png`}
              alt={e}
              width="50px"
              align="bottom"
              style={{ padding: '0 5px' }}
            />
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12}>
        <TextField
          label="Credit card number"
          name="ccnumber"
          variant="outlined"
          margin="dense"
          required
          fullWidth
          InputProps={{
            inputProps: {
              component: CardNumberElement,
            },
            inputComponent: StripeInput,
          }}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={6} sm={6}>
        <TextField
          label="Expiration date"
          name="ccexp"
          variant="outlined"
          margin="dense"
          required
          fullWidth
          InputProps={{
            inputProps: {
              component: CardExpiryElement,
            },
            inputComponent: StripeInput,
          }}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={6} sm={6}>
        <TextField
          label="CVC"
          name="cvc"
          variant="outlined"
          margin="dense"
          required
          fullWidth
          InputProps={{
            inputProps: {
              component: CardCvcElement,
            },
            inputComponent: StripeInput,
          }}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </>
  );
};

export default withSnackbar(PaymentForm);
