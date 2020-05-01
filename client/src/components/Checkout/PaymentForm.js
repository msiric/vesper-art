import React from 'react'; //, {useState }
import { TextField, Grid, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import { useStateValue } from '../Store/Stripe';
import StripeInput from './StripeInput';

const PaymentForm = () => {
  const [{ formValues }, dispatch] = useStateValue();

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
              src={`./cards/${e}.png`}
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
          label="Credit Card Number"
          name="ccnumber"
          variant="outlined"
          margin="dense"
          required
          fullWidth
          InputProps={{
            inputComponent: StripeInput,
            inputProps: {
              component: CardNumberElement,
            },
          }}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={6} sm={6}>
        <TextField
          label="Expiration Date"
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

export default PaymentForm;
