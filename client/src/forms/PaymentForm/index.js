import { Grid, TextField, Typography } from "@material-ui/core";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import React, { useImperativeHandle, useState } from "react";
import { useOrderCheckout } from "../../contexts/local/orderCheckout";

const PaymentFormStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: "100%",
  },
  container: {
    flex: 1,
    height: "100%",
  },
  artwork: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  root: {
    display: "flex",
    width: "100%",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  details: {
    display: "flex",
    width: "100%",
  },
  cover: {
    minWidth: 50,
    maxWidth: 200,
    width: "100%",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
    width: "100%",
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  rightList: {
    textAlign: "right",
  },
  manageLicenses: {
    padding: "8px 16px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
}));

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

const PaymentForm = ({ secret, version, loading }) => {
  const errors = useOrderCheckout((state) => state.errors);
  const reflectErrors = useOrderCheckout((state) => state.reflectErrors);

  const classes = PaymentFormStyles();

  console.log("STATE ERRORS", errors);
  const cardsLogo = [
    "amex",
    "cirrus",
    "diners",
    "dankort",
    "discover",
    "jcb",
    "maestro",
    "mastercard",
    "visa",
    "visaelectron",
  ];

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

  console.log("ERRORSSSSS", errors);

  return (
    <>
      <Grid container item xs={12}>
        <Grid item xs={12} sm={3}>
          <Typography variant="h6">Payment Data</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
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
          variant={"outlined"}
          margin="dense"
          loading={loading}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
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
          variant={"outlined"}
          margin="dense"
          loading={loading}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
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
          variant={"outlined"}
          margin="dense"
          loading={loading}
          fullWidth
        />
      </Grid>
    </>
  );
};

export default PaymentForm;
