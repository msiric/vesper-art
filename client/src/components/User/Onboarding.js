import React, { useContext } from 'react';
import { Context } from '../Store/Store';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SelectInput from '../../shared/SelectInput/SelectInput';
import { Grow, Card, CardContent, Typography, Button } from '@material-ui/core';
import { MonetizationOnRounded as MonetizationIcon } from '@material-ui/icons';
import ax from '../../axios.config';
import OnboardingStyles from './Onboarding.style';

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

const validationSchema = Yup.object().shape({
  userCountry: Yup.string().required('Country cannot be empty'),
});

function Onboarding() {
  const [store, dispatch] = useContext(Context);
  const classes = OnboardingStyles();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      userCountry: store.user.country || '',
    },
    validationSchema,
    async onSubmit(values) {
      try {
        if (!store.user.stripeId) {
          await ax.patch(`/api/user/${store.user.id}`, values);
          const { data } = await ax.post('/stripe/authorize', {
            country: values.userCountry,
            email: store.user.email,
          });
          window.location.href = data.url;
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grow in>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Card className={classes.card}>
              <CardContent className={classes.content}>
                <MonetizationIcon className={classes.media} />
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
                    store.user.country ? (
                    supportedCountries[store.user.country] ? (
                    <Typography color="textSecondary" className={classes.text}>
                      Please confirm your country Note: Stripe currently only
                      supports these countries:
                    </Typography>
                    ) : (
                    <Typography color="textSecondary" className={classes.text}>
                      Your currently saved country is not supported for Stripe
                      payments. Note: Stripe currently only supports these
                      countries:
                    </Typography>
                    ) ) : (
                    <Typography color="textSecondary" className={classes.text}>
                      Please select your country Note: Stripe currently only
                      supports these countries:
                    </Typography>
                    )
                  </>
                )}
                <SelectInput
                  name="userCountry"
                  label="Country"
                  value={values.userCountry}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  helperText={touched.userCountry ? errors.userCountry : ''}
                  error={touched.userCountry && Boolean(errors.userCountry)}
                  options={supportedCountries}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  fullWidth
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </form>
        </Grow>
      </div>
    </div>
  );
}

export default Onboarding;
