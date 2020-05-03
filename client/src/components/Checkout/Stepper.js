import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import {
  SentimentVerySatisfied,
  SentimentVeryDissatisfied,
} from '@material-ui/icons';
import StepperIcons from './StepperIcons';
import BillingForm from './BillingForm';
import PaymentForm from './PaymentForm';
import {
  useStripe,
  useElements,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { useStateValue } from '../Store/Stripe';
import StepConnector from './StepConnector';

// OVERALL STYLE
const style = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
  mainBox: {
    position: 'relative',
    marginTop: '-8px',
    padding: '10px 20px',
    borderBottomRightRadius: '4px',
    borderBottomLeftRadius: '4px',
    background: theme.palette.background.default,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
  },
}));

const StepContent = ({ step }) => {
  switch (step) {
    case 0:
      return <BillingForm />;
    case 1:
      return <PaymentForm />;
    default:
      return <></>;
  }
};

const Steppers = () => {
  const classes = style();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cardStatus, setCardStatus] = useState(true);
  const [cardMessage, setCardMessage] = useState('');

  const stripe = useStripe();
  const elements = useElements();
  const [{ formValues }, dispatch] = useStateValue();

  const handleNext = () => {
    if (activeStep === 1) {
      capture();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const handleReset = () => setActiveStep(0);

  const clientSecretDataObjectConverter = ({
    staff,
    arrivaldate,
    service,
    fsm,
    email: receipt_email,
    currency,
    amount,
  }) => ({
    amount: amount * 100,
    currency: currency.code,
    cardType: 'card',
    receipt_email,
    metadata: {
      staff,
      arrivaldate,
      service,
      fsm,
    },
  });

  const stripeDataObjectConverter = (
    { firstname, lastname, email, line1, line2, postal_code, city, country },
    cardElement
  ) => ({
    payment_method: {
      card: cardElement,
      billing_details: {
        address: {
          city,
          country: country.code,
          line1,
          line2,
          postal_code,
          state: null,
        },
        email,
        name: `${firstname} ${lastname}`,
        phone: null,
      },
    },
  });

  const capture = async () => {
    /*     setLoading(true);

        const clientSecretDataObject = clientSecretDataObjectConverter(formValues);
    const clientSecret = await clientSecretPull(clientSecretDataObject);
    const cardElement = elements.getElement(CardCvcElement);
    const stripeDataObject = stripeDataObjectConverter(formValues, cardElement);
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      stripeDataObject
    ); 

    if (error) {
      setCardStatus(false);
      setCardMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setCardStatus(true);
      setCardMessage('');
      dispatch({ type: 'emptyFormValue' });
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setLoading(false); */
  };

  return (
    <>
      <Stepper
        alternativeLabel
        connector={<StepConnector />}
        activeStep={activeStep}
      >
        {/* Change the number of loops here based on StepContent */}
        {[1, 2].map((e) => (
          <Step key={e}>
            <StepLabel StepIconComponent={StepperIcons} />
          </Step>
        ))}
      </Stepper>
      <Box className={classes.mainBox}>
        {activeStep === 2 ? (
          <Grid
            container
            spacing={3}
            direction="column"
            justify="space-around"
            alignItems="center"
            style={{ height: '400px' }}
          >
            {cardStatus ? (
              <SentimentVerySatisfied fontSize="large" color="primary" />
            ) : (
              <SentimentVeryDissatisfied fontSize="large" color="error" />
            )}
            <Typography variant="h4">{cardMessage}</Typography>
            <Button
              onClick={cardStatus ? handleReset : handleBack}
              className={classes.button}
            >
              {cardStatus ? 'Reset' : 'Back'}
            </Button>
          </Grid>
        ) : (
          <form
            autoComplete="off"
            className={classes.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
          >
            <Grid container spacing={3}>
              <StepContent step={activeStep} />
              <Grid container item justify="flex-end">
                <Button
                  disabled={activeStep === 0}
                  className={classes.button}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : activeStep === 1 ? (
                    'Pay'
                  ) : (
                    'Next'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    </>
  );
};

export default Steppers;