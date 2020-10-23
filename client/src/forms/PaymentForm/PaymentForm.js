import { Grid, TextField, Typography } from "@material-ui/core";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react"; //, {useState }
import { useHistory } from "react-router-dom";
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
  const [mountNode, setMountNode] = React.useState(null);

  React.useImperativeHandle(
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

export const StripeTextField = (props) => {
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
      {...other}
    />
  );
};

const PaymentForm = ({ secret, version }) => {
  const [state, setState] = useState({ elementError: {} });
  const classes = PaymentFormStyles();

  const stripe = useStripe();
  const history = useHistory();

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
    setState({
      ...state,
      elementError: {
        ...state.elementError,
        [event.elementType]: event.error.message,
      },
    });
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
      <Grid container item xs={12}>
        <Grid item xs={12} sm={3}>
          <Typography variant="h6">Payment Data</Typography>
        </Grid>
        <Grid container item xs={12} sm={9} justify="space-between">
          {cardsLogo.map((card) => (
            <img
              key={card}
              src={`../../../assets/images/cards/${card}.png`}
              alt={card}
              width="50px"
              align="bottom"
              style={{ padding: "0 5px" }}
            />
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12}>
        <StripeTextField
          error={Boolean(state.elementError.cardNumber)}
          helperText={state.elementError.cardNumber}
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
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={6}>
        <StripeTextField
          error={Boolean(state.elementError.cardExpiry)}
          helperText={state.elementError.cardExpiry}
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
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={6}>
        <StripeTextField
          error={Boolean(state.elementError.cardCvc)}
          helperText={state.elementError.cardCvc}
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
          fullWidth
        />
      </Grid>
    </>
  );
};

export default PaymentForm;
