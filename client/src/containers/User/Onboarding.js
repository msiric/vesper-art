import { Grow } from "@material-ui/core";
import { MonetizationOnRounded as MonetizationIcon } from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { countries } from "../../../../common/constants.js";
import { Context } from "../../context/Store.js";
import { postAuthorize } from "../../services/stripe.js";
import { patchOrigin } from "../../services/user.js";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "../../styles/theme.js";
import { originValidation } from "../../validation/origin.js";

const Onboarding = () => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        <Grid item sm={12} className={classes.grid}>
          <Grow in>
            <Card display="flex" justifyContent="center" alignItems="center">
              <CardContent
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <MonetizationIcon
                  className={classes.media}
                  style={{ fontSize: 150 }}
                />
                {store.user.stripeId ? (
                  <Typography variant="subtitle1" className={classes.heading}>
                    You already went through the onboarding process
                  </Typography>
                ) : (
                  <>
                    <Typography variant="subtitle1" className={classes.heading}>
                      Start getting paid
                    </Typography>
                    <Typography color="textSecondary" className={classes.text}>
                      On the next page you will be taken to Stripe's website
                      where you will finish the onboarding process. This is
                      mandatory in order to secure your balance and to generate
                      payouts on demand. It goes without saying that having
                      Stripe keep track of your balance and handle all the
                      transactions is much more secure and reliable than doing
                      this ourselves, so you can rest assured that your earnings
                      are safe and protected at all times.
                    </Typography>
                    <Typography color="textSecondary" className={classes.text}>
                      Note: We do not save any information that you enter on the
                      next page except the ID that Stripe returns back
                    </Typography>
                    {/* $TODO Refactor supportedCountries */}
                    {store.user.country ? (
                      supportedCountries[store.user.country] ? (
                        <Typography
                          color="textSecondary"
                          className={classes.text}
                        >
                          Please confirm your country Note: Stripe currently
                          only supports these countries:
                        </Typography>
                      ) : (
                        <Typography
                          color="textSecondary"
                          className={classes.text}
                        >
                          Your currently saved country is not supported for
                          Stripe payments. Note: Stripe currently only supports
                          these countries:
                        </Typography>
                      )
                    ) : (
                      <Typography
                        color="textSecondary"
                        className={classes.text}
                      >
                        Please select your country Note: Stripe currently only
                        supports these countries:
                      </Typography>
                    )}
                  </>
                )}
                <Formik
                  initialValues={{
                    userOrigin: store.user.origin || "",
                  }}
                  enableReinitialize={true}
                  validationSchema={originValidation}
                  onSubmit={async (values, { resetForm }) => {
                    try {
                      if (!store.user.stripeId) {
                        await patchOrigin({
                          userId: store.user.id,
                          data: values,
                        });
                        const { data } = await postAuthorize({
                          userOrigin: values.userOrigin,
                          userEmail: store.user.email,
                        });
                        window.location.href = data.url;
                      }
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  {({ values, errors, touched, isSubmitting }) => (
                    <Form className={classes.card}>
                      <Field name="userOrigin">
                        {({ field, form: { touched, errors }, meta }) => (
                          <SelectInput
                            {...field}
                            label="Country"
                            helperText={meta.touched && meta.error}
                            error={meta.touched && Boolean(meta.error)}
                            options={countries.map(
                              (country) => country.supported === true
                            )}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      </Field>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        fullWidth
                      >
                        Continue
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Onboarding;
