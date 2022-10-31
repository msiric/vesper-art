import { Grid, TextField } from "@material-ui/core";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import React, { useImperativeHandle, useState } from "react";
import { useOrderCheckout } from "../../contexts/local/orderCheckout";

export const StripeInput = (props) => {
  const {
    component: Component,
    inputRef,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribeBy,
    defaultValue,
    required,
    onKeyDown,
    onKeyUp,
    readOnly,
    autoComplete,
    autoFocus,
    type,
    name,
    rows,
    options,
    ...other
  } = props;
  const theme = useTheme();
  const [mountNode, setMountNode] = useState(null);

  useImperativeHandle(
    inputRef,
    () => ({
      focus: () => mountNode.focus(),
    }),
    [mountNode]
  );

  return (
    <Component
      onReady={setMountNode}
      options={{
        ...options,
        style: {
          base: {
            color: theme.palette.text.primary,
            fontSize: `${theme.typography.fontSize}px`,
            fontFamily: theme.typography.fontFamily,
            "::placeholder": {
              color: fade(theme.palette.text.primary, 0.42),
            },
          },
          invalid: {
            color: theme.palette.text.primary,
          },
        },
      }}
      {...other}
    />
  );
};

export const StripeTextField = ({ loading, ...props }) => {
  const {
    InputLabelProps,
    stripeElement,
    InputProps = {},
    inputProps,
    ...other
  } = props;

  return (
    <TextField
      fullWidth
      InputLabelProps={{
        ...InputLabelProps,
        shrink: true,
      }}
      InputProps={{
        ...InputProps,
        inputProps: {
          ...inputProps,
          ...InputProps.inputProps,
          component: stripeElement,
        },
        inputComponent: StripeInput,
      }}
      loading={loading}
      {...other}
    />
  );
};

const paymentFormStyles = makeStyles((muiTheme) => ({
  container: {
    "&>div": {
      padding: "0px 8px !important",
    },
  },
}));

const PaymentForm = ({ secret, version, loading }) => {
  const errors = useOrderCheckout((state) => state.errors);
  const reflectErrors = useOrderCheckout((state) => state.reflectErrors);

  const classes = paymentFormStyles();

  const onChange = (event) => {
    reflectErrors({ event });
  };

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
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12} sm={12}>
          <StripeTextField
            error={!!errors.cardNumber}
            helperText={errors.cardNumber}
            label="Card Number"
            inputProps={{
              options: {
                showIcon: true,
              },
            }}
            onChange={onChange}
            stripeElement={CardNumberElement}
            variant="outlined"
            margin="dense"
            loading={loading}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StripeTextField
            error={!!errors.cardExpiry}
            helperText={errors.cardExpiry}
            label="Card expiry date"
            inputProps={{
              options: {
                showIcon: true,
              },
            }}
            onChange={onChange}
            stripeElement={CardExpiryElement}
            variant="outlined"
            margin="dense"
            loading={loading}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StripeTextField
            error={!!errors.cardCvc}
            helperText={errors.cardCvc}
            label="Card CVC"
            inputProps={{
              options: {
                showIcon: true,
              },
            }}
            onChange={onChange}
            stripeElement={CardCvcElement}
            variant="outlined"
            margin="dense"
            loading={loading}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PaymentForm;
