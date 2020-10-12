import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getCheckout } from "../../services/checkout.js";
import BillingForm from "../BillingForm/BillingForm.js";
import LicenseForm from "../LicenseForm/LicenseForm.js";
import PaymentForm from "../PaymentForm/PaymentForm.js";
import { Context } from "../Store/Store.js";
import CheckoutStyles from "./Checkout.style.js";
import Summary from "./Summary.js";

const Checkout = ({ match, location }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    stripe: null,
    secret: null,
    artwork: {},
    billing: {},
    licenses: [],
    discount: {},
    loading: true,
    step: 0,
  });

  const history = useHistory();

  const classes = CheckoutStyles();

  const handleSecretSave = (value) => {
    setState((prevState) => ({ ...prevState, secret: value }));
  };

  const handleLicenseChange = async (license) => {
    try {
      const versionId = state.artwork.current._id.toString();
      const storageObject = {
        versionId: versionId,
        intentId: null,
        licenseType: license,
      };
      window.sessionStorage.setItem(
        state.artwork._id,
        JSON.stringify(storageObject)
      );
      setState((prevState) => ({
        ...prevState,
        license: license,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleBillingSave = async (billing) => {
    setState((prevState) => ({
      ...prevState,
      billing: billing,
    }));
  };

  const handleDiscountChange = (discount) => {
    setState((prevState) => ({
      ...prevState,
      discount: discount,
    }));
  };

  const retrieveLicenseInformation = (artwork) => {
    const checkoutItem = JSON.parse(
      window.sessionStorage.getItem(artwork._id.toString())
    );
    if (checkoutItem) {
      const currentId = artwork.current._id.toString();
      if (checkoutItem.versionId === currentId) {
        return checkoutItem.licenseList;
      } else {
        window.sessionStorage.removeItem(artwork._id);
        console.log("$TODO ENQUEUE MESSAGE, DELETE INTENT ON SERVER");
      }
    }
  };

  const handleStepChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      step: prevState.step + value,
    }));
  };

  const renderForm = ({ step }) => {
    if (step === 0)
      return (
        <LicenseForm
          artwork={artwork}
          license={license}
          handleSecretSave={handleSecretSave}
          handleLicenseChange={handleLicenseChange}
        />
      );
    else if (step === 1)
      return (
        <BillingForm billing={billing} handleBillingSave={handleBillingSave} />
      );
    else
      return (
        <PaymentForm
          secret={secret}
          artwork={artwork}
          license={license}
          discount={discount}
          billing={billing}
          handlePaymentSubmit={handlePaymentSubmit}
        />
      );
  };

  const fetchData = async () => {
    try {
      const billing = {
        firstname: "",
        lastname: "",
        email: "",
        address: "",
        zip: "",
        city: "",
        country: "",
      };
      const { data } = await getCheckout({ versionId: match.params.id });
      const stripe = await loadStripe(
        "pk_test_xi0qpLTPs3WI8YPUfTyeeyzt00tNwou20z"
      );
      const licenses = retrieveLicenseInformation(data.artwork);
      setState({
        ...state,
        loading: false,
        stripe: stripe,
        artwork: data.artwork,
        licenses: licenses ? licenses : [],
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
    <Container className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
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
                          licenseType: "",
                          licenseAssignee: "",
                          licenseCompany: "",
                          discountCode: "",
                          billingName: "",
                          billingSurname: "",
                          billingEmail: "",
                          billingAddress: "",
                          billingZip: "",
                          billingCity: "",
                          billingCountry: "",
                        }}
                        validationSchema={null}
                        onSubmit={async (values, { resetForm }) => {
                          /*  const formData = new FormData();
                          formData.append('artworkMedia', values.artworkMedia[0]);
                          try {
                            const {
                              data: { artworkCover, artworkMedia },
                            } = await postMedia({ data: formData });
                            values.artworkCover = artworkCover;
                            values.artworkMedia = artworkMedia;
                            const data = deleteEmptyValues(values);
                            await patchArtwork({ artworkId: match.params.id, data });
                            history.push({
                              pathname: '/',
                              state: { message: 'Artwork edited' },
                            });
                          } catch (err) {
                            console.log(err);
                          } */
                        }}
                      >
                        {({ isSubmitting }) => (
                          <Form>
                            {state.stripe ? (
                              <Elements stripe={state.stripe}>
                                <Stepper
                                  alternativeLabel
                                  connector={<Connector />}
                                  activeStep={state.step}
                                >
                                  {[1, 2, 3].map((e) => (
                                    <Step key={e}>
                                      <StepLabel
                                        StepIconComponent={StepperIcons}
                                      />
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
                                      style={{ height: "400px" }}
                                    ></Grid>
                                  ) : (
                                    <Grid container spacing={3}>
                                      {renderForm({
                                        step: state.step,
                                      })}
                                    </Grid>
                                  )}
                                </Box>
                              </Elements>
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
              <Summary
                artwork={state.artwork}
                licenses={state.licenses}
                discount={state.discount}
                handleDiscountChange={handleDiscountChange}
              />
              <br />
            </Grid>
          </>
        ) : (
          history.push("/")
        )}
      </Grid>
    </Container>
  );
};

export default Checkout;
