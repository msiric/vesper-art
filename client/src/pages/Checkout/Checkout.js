import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  CheckRounded as CheckIcon,
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
import { getCheckout, postDiscount } from '../../services/checkout.js';
import { postIntent } from '../../services/stripe.js';
import { postCheckout } from '../../services/user.js';
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
    license: location.state.license || '',
    discount: null,
    intent: null,
    step: {
      current: 0,
      length: STEPS.length,
    },
    loading: true,
  });

  const licenseOptions =
    state.license === 'personal'
      ? [
          {
            label: 'Personal blogging, websites and social media',
          },
          {
            label:
              'Home printing, art and craft projects, personal portfolios and gifts',
          },
          { label: 'Students and charities' },
          {
            label:
              'The personal use license is not suitable for commercial activities',
          },
        ]
      : [
          {
            label:
              'Print and digital advertising, broadcasts, product packaging, presentations, websites and blogs',
          },
          {
            label:
              'Home printing, art and craft projects, personal portfolios and gifts',
          },
          { label: 'Students and charities' },
          {
            label:
              'The personal use license is not suitable for commercial activities',
          },
        ];

  const elements = useElements();
  const history = useHistory();

  const classes = {};

  const handleLicenseChange = async (license, setFieldValue) => {
    try {
      setFieldValue(license.name, license.value);
      setState((prevState) => ({
        ...prevState,
        license: license.value,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDiscountChange = async (values, actions) => {
    try {
      const intentId = store.user.intents[state.version._id] || null;
      const {
        data: { payload },
      } = values
        ? await postDiscount({ data: values })
        : { data: { payload: null } };
      if (intentId) {
        await postIntent({
          versionId: state.version._id,
          artworkLicense: {
            assignee: '',
            company: '',
            type: state.license,
          },
          discountId: payload ? payload._id : null,
          intentId,
        });
      }
      setState((prevState) => {
        console.log(prevState);
        return { ...prevState, discount: payload };
      });
      actions && actions.setSubmitting(false);
    } catch (err) {
      console.log(err);
    }
  };

  const saveIntent = async (values, actions) => {
    try {
      const intentId = store.user.intents[state.version._id] || null;
      const { data } = await postIntent({
        versionId: state.version._id,
        artworkLicense: {
          assignee: values.licenseAssignee,
          company: values.licenseCompany,
          type: values.licenseType,
        },
        discountId: state.discount ? state.discount._id : null,
        intentId,
      });
      if (!intentId) {
        try {
          await postCheckout({
            userId: store.user.id,
            data: {
              version: state.version._id,
              intentId: data.intent.id,
            },
          });
          dispatch({
            type: 'updateIntents',
            intents: {
              [state.version._id]: data.intent.id,
            },
          });
        } catch (err) {
          console.log(err);
        }
      }
      setState((prevState) => ({
        ...prevState,
        secret: data.intent.secret,
      }));
      actions.setSubmitting(false);
      handleStepChange(1);
    } catch (err) {
      console.log(err);
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
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
            country: values.billingCountry.value,
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
    actions.setSubmitting(false);
  };

  const handleSubmit = (values, actions) => {
    const isFirstStep = state.step.current === 0;
    const isLastStep = state.step.current === state.step.length - 1;
    if (isLastStep) {
      submitForm(values, actions);
    } else if (isFirstStep) {
      saveIntent(values, actions);
    } else {
      handleStepChange(1);
      actions.setSubmitting(false);
    }
  };

  const renderForm = (step) => {
    switch (step) {
      case 0:
        return (
          <LicenseForm
            version={state.version}
            license={state.license}
            handleLicenseChange={handleLicenseChange}
          />
        );
      case 1:
        return <BillingForm />;
      case 2:
        return <PaymentForm secret={state.secret} version={state.version} />;

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
      const { data } = await getCheckout({ versionId: match.params.id });
      /*       const license = retrieveLicenseInformation(data.artwork); */
      setState((prevState) => ({
        ...state,
        loading: false,
        version: data.version,
        billing: billing,
        discount: data.discount,
      }));
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
        ) : state.version._id ? (
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
                          licenseType: location.state.license || '',
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
                                    {console.log(values)}
                                    {renderForm(state.step.current)}
                                    {state.step.current === 0 && (
                                      <List
                                        component="nav"
                                        aria-label="Features"
                                      >
                                        {licenseOptions.map((item) => (
                                          <ListItem>
                                            <ListItemIcon>
                                              <CheckIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={item.label}
                                            />
                                          </ListItem>
                                        ))}
                                      </List>
                                    )}
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
                                    disabled={isSubmitting}
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
                version={state.version}
                license={state.license}
                discount={state.discount}
                handleDiscountChange={handleDiscountChange}
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
