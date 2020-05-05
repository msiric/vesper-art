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
import StepperIcons from './StepperIcons';
import LicenseForm from './LicenseForm';
import BillingForm from './BillingForm';
import PaymentForm from './PaymentForm';
import {
  useStripe,
  useElements,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { useStateValue } from '../Store/Stripe';
import { useHistory } from 'react-router-dom';
import ax from '../../axios.config';
import * as Yup from 'yup';
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
      return <LicenseForm />;
    case 1:
      return <BillingForm />;
    case 2:
      return <PaymentForm />;
    default:
      return <></>;
  }
};

const Steppers = () => {
  const classes = style();
  const [loading, setLoading] = useState(false);
  const [cardStatus, setCardStatus] = useState(true);
  const [cardMessage, setCardMessage] = useState('');

  const stripe = useStripe();
  const elements = useElements();
  const [{ main, formValues }, dispatch] = useStateValue();

  const history = useHistory();

  const handleNext = () => {
    if (main.step === 2) {
      capture();
    } else {
      handleStepChange(1);
    }
  };
  const handleBack = () => handleStepChange(-1);

  const handleStepChange = (value) => {
    dispatch({
      type: 'editMainValue',
      key: 'step',
      value: main.step + value,
    });
  };

  useEffect(() => {
    const checkoutItem = JSON.parse(
      window.sessionStorage.getItem(main.artwork._id)
    );
    if (checkoutItem) {
      const currentId = main.artwork.current._id.toString();
      if (checkoutItem.versionId === currentId) {
        dispatch({
          type: 'editFormValue',
          key: 'licenses',
          value: [...formValues.licenses, ...checkoutItem.licenseList],
        });
      } else {
        window.sessionStorage.removeItem(main.artwork._id);
        console.log('$TODO ENQUEUE MESSAGE, DELETE INTENT ON SERVER');
      }
    }
  }, []);

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
        activeStep={main.step}
      >
        {/* Change the number of loops here based on StepContent */}
        {[1, 2, 3].map((e) => (
          <Step key={e}>
            <StepLabel StepIconComponent={StepperIcons} />
          </Step>
        ))}
      </Stepper>
      <Box className={classes.mainBox}>
        {main.step === 3 ? (
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
            <Button onClick={handleBack} className={classes.button}>
              Back
            </Button>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <StepContent step={main.step} />
          </Grid>
        )}
      </Box>
    </>
  );
};

export default Steppers;
