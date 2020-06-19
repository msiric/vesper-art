import React from 'react'; //, {useState }
import { TextField, Grid, Typography, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { withSnackbar } from 'notistack';
import StripeInput from './StripeInput.js';
import { useHistory } from 'react-router-dom';
import PaymentFormStyles from './PaymentForm.style.js';

const PaymentForm = ({
  secret,
  artwork,
  licenses,
  billing,
  discount,
  handleStepChange,
  enqueueSnackbar,
}) => {
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

  const handlePaymentSubmit = async () => {
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
  };

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
              src={`../../assets/images/cards/${e}.png`}
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
      <Grid container item justify="flex-end">
        <Button className={classes.button} onClick={() => handleStepChange(-1)}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
          onClick={handlePaymentSubmit}
        >
          Pay
        </Button>
      </Grid>
    </>
  );
};

export default withSnackbar(PaymentForm);
