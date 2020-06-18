import React, { useState, useEffect } from 'react';
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
import StepperIcons from './StepperIcons.js';
import LicenseForm from './LicenseForm.js';
import BillingForm from './BillingForm.js';
import PaymentForm from './PaymentForm.js';
import {
  useStripe,
  useElements,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { useHistory } from 'react-router-dom';
import { ax } from '../../shared/Interceptor/Interceptor.js';
import * as Yup from 'yup';
import StepConnector from './StepConnector.js';

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

const Steppers = ({
  secret,
  artwork,
  licenses,
  billing,
  discount,
  handlePaymentSubmit,
  handleSecretSave,
  handleLicenseSave,
  handleBillingSave,
}) => {
  const classes = style();
  const [state, setState] = useState({
    step: 0,
  });

  const history = useHistory();

  const handleStepChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      step: prevState.step + value,
    }));
  };

  const renderForm = ({ step, handleStepChange }) => {
    if (step === 0)
      return (
        <LicenseForm
          artwork={artwork}
          licenses={licenses}
          handleSecretSave={handleSecretSave}
          handleStepChange={handleStepChange}
          handleLicenseSave={handleLicenseSave}
        />
      );
    else if (step === 1)
      return (
        <BillingForm
          billing={billing}
          handleStepChange={handleStepChange}
          handleBillingSave={handleBillingSave}
        />
      );
    else
      return (
        <PaymentForm
          secret={secret}
          artwork={artwork}
          licenses={licenses}
          discount={discount}
          billing={billing}
          handlePaymentSubmit={handlePaymentSubmit}
          handleStepChange={handleStepChange}
        />
      );
  };

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
    { firstname, lastname, email, address, zip, city, country },
    cardElement
  ) => ({
    payment_method: {
      card: cardElement,
      billing_details: {
        address: {
          city,
          country: country.code,
          address,
          zip,
          state: null,
        },
        email,
        name: `${firstname} ${lastname}`,
        phone: null,
      },
    },
  });

  const handleSubmit = async (e) => {
    /*     e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value
        }
      }
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      console.log("[error]", payload.error);
    } else {
      setError(null);
      setSucceeded(true);
      setProcessing(false);
      setMetadata(payload.paymentIntent);
      console.log("[PaymentIntent]", payload.paymentIntent);
    } */
  };

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
        activeStep={state.step}
      >
        {/* Change the number of loops here based on StepContent */}
        {[1, 2, 3].map((e) => (
          <Step key={e}>
            <StepLabel StepIconComponent={StepperIcons} />
          </Step>
        ))}
      </Stepper>
      <Box className={classes.mainBox}>
        {state.step === 3 ? (
          <Grid
            container
            spacing={3}
            direction="column"
            justify="space-around"
            alignItems="center"
            style={{ height: '400px' }}
          >
            {/*             {cardStatus ? (
              <SentimentVerySatisfied fontSize="large" color="primary" />
            ) : (
              <SentimentVeryDissatisfied fontSize="large" color="error" />
            )}
            <Typography variant="h4">{cardMessage}</Typography>
            <Button onClick={handleBack} className={classes.button}>
              Back
            </Button> */}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {renderForm({
              step: state.step,
              handleStepChange: handleStepChange,
            })}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default Steppers;
