import { Button, CardActions, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Container, Grid } from '../../constants/theme.js';

const LicenseFormStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
  },
  artwork: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  root: {
    display: 'flex',
    width: '100%',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  details: {
    display: 'flex',
    width: '100%',
  },
  cover: {
    minWidth: 50,
    maxWidth: 200,
    width: '100%',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
    width: '100%',
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  rightList: {
    textAlign: 'right',
  },
  manageLicenses: {
    padding: '8px 16px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const validationSchema = Yup.object().shape({
  licenses: Yup.array().of(
    Yup.object().shape({
      licenseType: Yup.string()
        .matches(/(personal|commercial)/)
        .required('License type is required'),
    })
  ),
});

const OrderSummary = ({ artwork, license, discount, handleDiscountDelete }) => {
  const [state, setState] = useState({ loading: false });
  const classes = LicenseFormStyles();

  const retrieveIntentId = () => {
    const checkoutItem = JSON.parse(
      window.sessionStorage.getItem(artwork._id.toString())
    );
    if (checkoutItem) {
      const currentId = artwork.current._id.toString();
      if (checkoutItem.versionId === currentId) {
        return checkoutItem.intentId;
      } else {
        window.sessionStorage.removeItem(artwork._id);
        console.log('$TODO ENQUEUE MESSAGE, DELETE INTENT ON SERVER');
      }
    }
  };

  const licenseOptions =
    license === 'personal'
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

  return (
    <Container fixed p={2}>
      <Grid container>
        <Typography variant="h5">Order summary</Typography>
        <Grid item xs={12} className={classes.actions}>
          <Grid item xs={12}>
            {/* Update intent when discount changes */}
            {discount ? (
              <Button
                type="button"
                color="error"
                onClick={() => handleDiscountDelete('discountCode')}
                fullWidth
              >
                Remove discount
              </Button>
            ) : (
              <>
                <Field name="discountCode">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      onBlur={() => null}
                      label="Discount"
                      type="text"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                </Field>
                <CardActions className={classes.actions}>
                  <Button type="submit" color="primary" fullWidth>
                    Apply
                  </Button>
                </CardActions>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderSummary;
