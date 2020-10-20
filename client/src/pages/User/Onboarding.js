import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  LabelImportantRounded as LabelIcon,
  MonetizationOnRounded as MonetizationIcon,
} from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { countries } from "../../../../common/constants.js";
import AutocompleteInput from "../../components/AutocompleteInput/AutocompleteInput.js";
import HelpBox from "../../components/HelpBox/HelpBox.js";
import { UserContext } from "../../contexts/User.js";
import { postAuthorize } from "../../services/stripe.js";
import { patchOrigin } from "../../services/user.js";
import globalStyles from "../../styles/global.js";
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
  const [userStore] = useContext(UserContext);

  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Card>
            <CardContent
              style={{ display: "flex" }}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              p={2}
            >
              <HelpBox
                type="alert"
                label="Stripe currently only supports countries found in the dropdown below"
                margin={4}
              />
              <MonetizationIcon style={{ fontSize: 150 }} />
              {userStore.stripeId ? (
                <Typography variant="subtitle1" mb={4}>
                  You already went through the onboarding process
                </Typography>
              ) : (
                <>
                  <Typography variant="h4" mb={4}>
                    Start getting paid
                  </Typography>
                  <Typography color="textSecondary" mb={4}>
                    We use Stripe to make sure you get paid on time and to keep
                    your personal bank and details secure. Click on continue to
                    set up your payments on Stripe.
                  </Typography>
                  <List
                    component="nav"
                    aria-label="Becoming a seller"
                    style={{ marginBottom: 30 }}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <LabelIcon />
                      </ListItemIcon>
                      <ListItemText primary="Complete the onboarding process" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LabelIcon />
                      </ListItemIcon>
                      <ListItemText primary="Upload your artwork" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LabelIcon />
                      </ListItemIcon>
                      <ListItemText primary="Set how much you want to charge for personal and commercial licenses" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LabelIcon />
                      </ListItemIcon>
                      <ListItemText primary="Transfer your earnings from your dashboard to your Stripe account" />
                    </ListItem>
                  </List>
                  {/* $TODO Refactor supportedCountries */}
                  {userStore.origin ? (
                    countries[userStore.origin] &&
                    countries[userStore.origin].supported ? (
                      <Typography
                        color="textSecondary"
                        style={{ alignSelf: "flex-start" }}
                      >
                        Please confirm your registered business address
                      </Typography>
                    ) : (
                      <Typography
                        color="textSecondary"
                        style={{ alignSelf: "flex-start" }}
                      >
                        Your currently saved registered business address is not
                        supported for Stripe payments
                      </Typography>
                    )
                  ) : (
                    <Typography
                      color="textSecondary"
                      style={{ alignSelf: "flex-start" }}
                    >
                      Please select your registered business address
                    </Typography>
                  )}
                </>
              )}
              <Formik
                initialValues={{
                  userOrigin: "",
                }}
                enableReinitialize={true}
                validationSchema={originValidation}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    if (!userStore.stripeId) {
                      await patchOrigin.request({
                        userId: userStore.id,
                        data: {
                          ...values,
                          userOrigin: values.userOrigin.value,
                        },
                      });
                      const { data } = await postAuthorize.request({
                        userOrigin: values.userOrigin.value,
                        userEmail: userStore.email,
                      });

                      window.location.href = data.url;
                    }
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                {({ values, errors, touched, isSubmitting }) => (
                  <Form style={{ width: "100%" }}>
                    <Field name="userOrigin">
                      {({
                        field,
                        form: {
                          touched,
                          errors,
                          setFieldTouched,
                          setFieldValue,
                        },
                        meta,
                      }) => (
                        <AutocompleteInput
                          {...field}
                          label="Country"
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
                          helperText={meta.touched && meta.error}
                          error={meta.touched && Boolean(meta.error)}
                          options={countries.filter(
                            (country) => country.supported === true
                          )}
                          handleChange={(e, item) =>
                            setFieldValue("userOrigin", item || "")
                          }
                          handleBlur={() => setFieldTouched("userOrigin", true)}
                          getOptionLabel={(option) => option.text}
                        />
                      )}
                    </Field>
                    <Button
                      type="submit"
                      variant="outlined"
                      color="primary"
                      fullWidth
                    >
                      Continue
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Onboarding;
