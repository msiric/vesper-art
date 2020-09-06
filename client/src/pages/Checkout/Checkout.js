import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Paper,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  withStyles,
} from '@material-ui/core';
import {
  CardMembershipRounded as LicenseIcon,
  ContactMailRounded as BillingIcon,
  PaymentRounded as PaymentIcon,
} from '@material-ui/icons';
import {
  CardNumberElement,
  Elements,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.js';
import BillingForm from '../../containers/BillingForm/BillingForm.js';
import CheckoutSummary from '../../containers/CheckoutSummary/CheckoutSummary.js';
import LicenseForm from '../../containers/LicenseForm/LicenseForm.js';
import PaymentForm from '../../containers/PaymentForm/PaymentForm.js';
import { Context } from '../../context/Store.js';
import { getCheckout } from '../../services/checkout.js';
import { billingValidation } from '../../validation/billing.js';
import { licenseValidation } from '../../validation/license.js';
const STEPS = [
  'License information',
  'Billing information',
  'Payment information',
];

const checkoutValidation = [licenseValidation, billingValidation, null];

const validationSchema = Yup.object().shape({
  discountCode: Yup.string().trim().required('Discount cannot be empty'),
});

const iconsStyle = makeStyles((theme) => ({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    background: theme.palette.primary.main,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    background: theme.palette.primary.main,
  },
}));

const StepperIcons = ({ active, completed, icon }) => {
  const classes = iconsStyle();

  const icons = {
    1: <LicenseIcon />,
    2: <BillingIcon />,
    3: <PaymentIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(icon)]}
    </div>
  );
};

const Connector = withStyles((theme) => ({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      background: theme.palette.primary.main,
    },
  },
  completed: {
    '& $line': {
      background: theme.palette.primary.main,
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}))(StepConnector);

const Checkout = ({ match, location }) => {
  const [state, setState] = useState({
    stripe: null,
    loading: true,
  });

  const fetchData = async () => {
    try {
      const stripe = await loadStripe(
        'pk_test_xi0qpLTPs3WI8YPUfTyeeyzt00tNwou20z'
      );
      setState({
        ...state,
        loading: false,
        stripe: stripe,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return state.loading ? (
    <LoadingSpinner />
  ) : (
    <Elements stripe={state.stripe}>
      <Processor match={match} location={location} stripe={state.stripe} />
    </Elements>
  );
};

const Processor = ({ match, location, stripe }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    secret: null,
    artwork: {},
    license: '',
    discount: null,
    step: {
      current: 0,
      length: STEPS.length,
    },
    loading: true,
  });

  const elements = useElements();
  const history = useHistory();

  const classes = {};
  const isLastStep = state.step.current === state.step.length - 1;

  const handleSecretSave = (value) => {
    setState((prevState) => ({ ...prevState, secret: value }));
  };

  const handleLicenseChange = async (license) => {
    try {
      /*       const versionId = state.artwork.current._id.toString();
      const storageObject = {
        versionId: versionId,
        intentId: null,
        licenseType: license,
      };
      window.sessionStorage.setItem(
        state.artwork._id,
        JSON.stringify(storageObject)
      ); */
      setState((prevState) => ({
        ...prevState,
        license: license,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDiscountChange = (value) => {
    setState((prevState) => ({ ...prevState, discount: value }));
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

  const handleStepChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      step: { ...prevState.step, current: prevState.step.current + value },
    }));
  };

  const submitForm = async (values, actions) => {
    if (!state.secret || !stripe || !elements) {
      console.log('nije dobro');
      console.log(state.secret, stripe, elements);
      // $TODO Enqueue error;
    }
    const cardElement = elements.getElement(CardNumberElement);
    const stripeData = {
      payment_method: {
        card: cardElement,
        billing_details: {
          address: {
            city: values.billingCity,
            country: values.billingCountry,
            line1: values.billingAddress,
            line2: null,
            postal_code: values.billingZip,
            state: null,
          },
          email: values.billingEmail,
          name: `${values.billingName} ${values.billingSurname}`,
          phone: null,
        },
      },
    };
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      state.secret,
      stripeData
    );

    if (error) {
      console.log('fail');
      console.log(error);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('success');
      /*         enqueueSnackbar('Payment successful', {
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
        }); */
    }
  };

  const handleSubmit = (values, actions) => {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      handleStepChange(1);
    }
  };

  const renderForm = (step) => {
    switch (step) {
      case 0:
        return (
          <LicenseForm
            artwork={state.artwork}
            license={state.license}
            handleLicenseChange={handleLicenseChange}
          />
        );
      case 1:
        return <BillingForm />;
      case 2:
        return <PaymentForm secret={state.secret} artwork={state.artwork} />;

      default:
        return <div>Not Found</div>;
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
      /*       const license = retrieveLicenseInformation(data.artwork); */
      setState({
        ...state,
        loading: false,
        artwork: data.artwork,
        license: location.state.license,
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
          <LoadingSpinner />
        ) : state.artwork._id ? (
          <>
            <Grid item xs={12} md={8} className={classes.artwork}>
              <Box component="main">
                <Container maxWidth="md">
                  {state.loading ? (
                    <CircularProgress />
                  ) : (
                    <Paper elevation={5}>
                      <Formik
                        initialValues={{
                          discountCode: state.discount,
                          licenseType: state.license,
                          licenseAssignee: '',
                          licenseCompany: '',
                          billingName: '',
                          billingSurname: '',
                          billingEmail: '',
                          billingAddress: '',
                          billingZip: '',
                          billingCity: '',
                          billingCountry: '',
                        }}
                        enableReinitialize
                        validationSchema={
                          checkoutValidation[state.step.current]
                        }
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting, values, setFieldValue }) => (
                          <Form>
                            {stripe ? (
                              <Box>
                                <Stepper
                                  alternativeLabel
                                  connector={<Connector />}
                                  activeStep={state.step.current}
                                >
                                  {STEPS.map((e) => (
                                    <Step key={e}>
                                      <StepLabel
                                        StepIconComponent={StepperIcons}
                                      />
                                    </Step>
                                  ))}
                                </Stepper>
                                <Box className={classes.mainBox}>
                                  <Grid container spacing={3}>
                                    {renderForm(state.step.current)}
                                  </Grid>
                                </Box>
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Button
                                    disabled={state.step.current === 0}
                                    className={classes.button}
                                    onClick={() => handleStepChange(-1)}
                                  >
                                    Back
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    type="submit"
                                  >
                                    {state.loading ? (
                                      <CircularProgress
                                        color="secondary"
                                        size={24}
                                      />
                                    ) : (
                                      'Next'
                                    )}
                                  </Button>
                                </Box>
                              </Box>
                            ) : null}
                          </Form>
                        )}
                      </Formik>
                    </Paper>
                  )}
                </Container>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} className={classes.actions}>
              <CheckoutSummary
                artwork={state.artwork}
                license={state.license}
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
