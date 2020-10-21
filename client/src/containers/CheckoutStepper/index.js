import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import { CheckRounded as CheckIcon } from "@material-ui/icons";
import { CardNumberElement, useElements } from "@stripe/react-stripe-js";
import { Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { UserContext } from "../../contexts/User.js";
import BillingForm from "../../forms/BillingForm/BillingForm.js";
import LicenseForm from "../../forms/LicenseForm/LicenseForm.js";
import PaymentForm from "../../forms/PaymentForm/PaymentForm.js";
import { getCheckout, postDiscount } from "../../services/checkout.js";
import { postIntent } from "../../services/stripe.js";
import { postCheckout } from "../../services/user.js";
import globalStyles from "../../styles/global.js";
import checkoutStepperStyles from "./styles.js";

const CheckoutProcessor = ({ match, location, stripe }) => {
  const [userStore, userDispatch] = useContext(UserContext);
  const [state, setState] = useState({
    ...initialState,
    license: location.state.license || initialState.license,
  });

  const licenseOptions =
    state.license === "personal"
      ? [
          {
            label: "Personal blogging, websites and social media",
          },
          {
            label:
              "Home printing, art and craft projects, personal portfolios and gifts",
          },
          { label: "Students and charities" },
          {
            label:
              "The personal use license is not suitable for commercial activities",
          },
        ]
      : [
          {
            label:
              "Print and digital advertising, broadcasts, product packaging, presentations, websites and blogs",
          },
          {
            label:
              "Home printing, art and craft projects, personal portfolios and gifts",
          },
          { label: "Students and charities" },
          {
            label:
              "The personal use license is not suitable for commercial activities",
          },
        ];

  const elements = useElements();
  const history = useHistory();

  const globalClasses = globalStyles();
  const classes = checkoutStepperStyles();

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
      const intentId = userStore.intents[state.version._id] || null;
      const {
        data: { payload },
      } = values
        ? await postDiscount.request({ data: values })
        : { data: { payload: null } };
      if (intentId) {
        await postIntent.request({
          versionId: state.version._id,
          artworkLicense: {
            assignee: "",
            company: "",
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
      const intentId = userStore.intents[state.version._id] || null;
      const { data } = await postIntent.request({
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
          await postCheckout.request({
            userId: userStore.id,
            data: {
              version: state.version._id,
              intentId: data.intent.id,
            },
          });
          userDispatch({
            type: "updateIntents",
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
      console.log("nije dobro");
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
      console.log("fail");
      console.log(error);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("success");
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
    history.push("/orders");
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
    actions.setTouched({});
  };

  const renderForm = (step) => {
    switch (step) {
      case 0:
        return (
          <LicenseForm
            version={state.version}
            license={state.license}
            handleLicenseChange={handleLicenseChange}
            loading={state.loading}
          />
        );
      case 1:
        return <BillingForm loading={state.loading} />;
      case 2:
        return (
          <PaymentForm
            secret={state.secret}
            version={state.version}
            loading={state.loading}
          />
        );

      default:
        return <div>Not Found</div>;
    }
  };

  const fetchData = async () => {
    try {
      console.log(location.state.license);
      setState({
        ...initialState,
        license: location.state.license || initialState.license,
      });
      const billing = {
        firstname: "",
        lastname: "",
        email: "",
        address: "",
        zip: "",
        city: "",
        country: "",
      };
      const { data } = await getCheckout.request({
        versionId: match.params.id,
      });
      /*       const license = retrieveLicenseInformation(data.artwork); */
      setState((prevState) => ({
        ...prevState,
        loading: false,
        version: data.version,
        billing: billing,
        discount: data.discount,
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  return (
    <Formik
      initialValues={{
        licenseType: location.state.license || "",
        licenseAssignee: "",
        licenseCompany: "",
        billingName: "",
        billingSurname: "",
        billingEmail: "",
        billingAddress: "",
        billingZip: "",
        billingCity: "",
        billingCountry: "",
      }}
      validationSchema={checkoutValidation[state.step.current]}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <Card elevation={5}>
            <CardContent>
              {state.loading || stripe ? (
                <Box>
                  <SkeletonWrapper
                    variant="text"
                    loading={state.loading}
                    width="100%"
                  >
                    <Stepper
                      alternativeLabel
                      connector={<Connector />}
                      activeStep={state.step.current}
                    >
                      {STEPS.map((e) => (
                        <Step key={e}>
                          <StepLabel StepIconComponent={StepperIcons} />
                        </Step>
                      ))}
                    </Stepper>
                  </SkeletonWrapper>
                  <Box>
                    <Grid container spacing={3}>
                      {renderForm(state.step.current)}
                      {state.step.current === 0 && (
                        <List
                          component="nav"
                          aria-label="Features"
                          style={{ width: "100%" }}
                        >
                          {licenseOptions.map((item) => (
                            <ListItem>
                              <SkeletonWrapper
                                variant="text"
                                loading={state.loading}
                                style={{ marginRight: 10 }}
                              >
                                <ListItemIcon>
                                  <CheckIcon />
                                </ListItemIcon>
                              </SkeletonWrapper>
                              <SkeletonWrapper
                                variant="text"
                                loading={state.loading}
                              >
                                <ListItemText primary={item.label} />
                              </SkeletonWrapper>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Grid>
                  </Box>
                </Box>
              ) : null}
            </CardContent>
            <CardActions
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <SkeletonWrapper loading={state.loading}>
                <Button
                  variant="outlined"
                  disabled={state.step.current === 0}
                  onClick={() => handleStepChange(-1)}
                >
                  Back
                </Button>
              </SkeletonWrapper>
              <SkeletonWrapper loading={state.loading}>
                <Button
                  variant="outlined"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {state.loading ? (
                    <CircularProgress color="secondary" size={24} />
                  ) : (
                    "Next"
                  )}
                </Button>
              </SkeletonWrapper>
            </CardActions>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default CheckoutProcessor;
