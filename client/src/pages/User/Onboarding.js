import React, { useContext } from 'react';
import { Context } from '../../context/Store.js';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import SelectInput from '../../shared/SelectInput/SelectInput.js';
import {
  Grow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Grid,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
} from '../../constants/theme.js';
import { MonetizationOnRounded as MonetizationIcon } from '@material-ui/icons';
import { patchUser, patchOrigin } from '../../services/user.js';
import { postAuthorize } from '../../services/stripe.js';
import { originValidation } from '../../validation/origin.js';
import HelpBox from '../../components/HelpBox/HelpBox.js';
import { LabelImportantRounded as LabelIcon } from '@material-ui/icons';

const supportedCountries = [
  { value: '' },
  { value: 'AE', text: 'Australia' },
  { value: 'AT', text: 'Austria' },
  { value: 'BE', text: 'Belgium' },
  { value: 'CA', text: 'Canada' },
  { value: 'DE', text: 'Denmark' },
  { value: 'EE', text: 'Estonia' },
  { value: 'FI', text: 'Finland' },
  { value: 'FR', text: 'France' },
  { value: 'DE', text: 'Germany' },
  { value: 'GR', text: 'Greece' },
  { value: 'HK', text: 'Honk Kong SAR China' },
  { value: 'IE', text: 'Ireland' },
  { value: 'IT', text: 'Italy' },
  { value: 'JP', text: 'Japan' },
  { value: 'LV', text: 'Latvia' },
  { value: 'LT', text: 'Lithuania' },
  { value: 'LU', text: 'Luxembourg' },
  { value: 'NL', text: 'Netherlands' },
  { value: 'NZ', text: 'New Zealand' },
  { value: 'NO', text: 'Norway' },
  { value: 'PL', text: 'Poland' },
  { value: 'PT', text: 'Portugal' },
  { value: 'SG', text: 'Singapore' },
  { value: 'SK', text: 'Slovakia' },
  { value: 'SI', text: 'Slovenia' },
  { value: 'ES', text: 'Spain' },
  { value: 'SE', text: 'Sweden' },
  { value: 'CH', text: 'Switzerland' },
  { value: 'GB', text: 'United Kingdom' },
  { value: 'US', text: 'United States' },
];

const Onboarding = () => {
  const [store, dispatch] = useContext(Context);

  return (
    <Container fixed>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Grow in>
            <Card>
              <CardContent
                style={{ display: 'flex' }}
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
                {store.user.stripeId ? (
                  <Typography variant="subtitle1" mb={4}>
                    You already went through the onboarding process
                  </Typography>
                ) : (
                  <>
                    <Typography variant="h4" mb={4}>
                      Start getting paid
                    </Typography>
                    <Typography color="textSecondary" mb={4}>
                      On the next page you will be taken to Stripe's website
                      where you will finish the onboarding process. This is
                      mandatory in order to secure your balance and to generate
                      payouts on demand. It goes without saying that having
                      Stripe keep track of your balance and handle all the
                      transactions is much more secure and reliable than doing
                      this ourselves, so you can rest assured that your earnings
                      are safe and protected at all times.
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
                    {store.user.origin ? (
                      supportedCountries[store.user.origin] ? (
                        <Typography color="textSecondary">
                          Please confirm your registered business address
                        </Typography>
                      ) : (
                        <Typography color="textSecondary">
                          Your currently saved registered business address is
                          not supported for Stripe payments
                        </Typography>
                      )
                    ) : (
                      <Typography color="textSecondary">
                        Please select your registered business address
                      </Typography>
                    )}
                  </>
                )}
                <Formik
                  initialValues={{
                    userOrigin: store.user.origin || '',
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
                    <Form style={{ width: '100%' }}>
                      <Field name="userOrigin">
                        {({ field, form: { touched, errors }, meta }) => (
                          <SelectInput
                            {...field}
                            label="Country"
                            helperText={meta.touched && meta.error}
                            error={meta.touched && Boolean(meta.error)}
                            options={supportedCountries}
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
