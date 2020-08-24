import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CheckRounded as CheckIcon } from '@material-ui/icons';
import { Field } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import CheckoutCard from '../../components/CheckoutCard/CheckoutCard.js';
import { Container, Grid } from '../../constants/theme.js';
import SelectInput from '../../shared/SelectInput/SelectInput.js';

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

const LicenseForm = ({ artwork, license }) => {
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
        <Grid item xs={12} className={classes.artwork}>
          <CheckoutCard artwork={artwork} />
        </Grid>
        <Grid item xs={12} className={classes.actions}>
          {/*           <Formik
            initialValues={{
              licenseType: license.type,
              licenseAssignee: license.assignee,
              licenseCompany: license.company,
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={async (values) => {}}
          >
            {({ values, errors, touched, enableReinitialize }) => (
              <Form style={{ width: '100%' }}> */}
          <Grid item xs={12}>
            <Field name="licenseAssignee">
              {({ field, form: { touched, errors }, meta }) => (
                <TextField {...field} />
              )}
            </Field>
            <Field name="licenseCompany">
              {({ field, form: { touched, errors }, meta }) => (
                <TextField {...field} />
              )}
            </Field>
            {/*             <TextInput name="licenseAssignee" label="License assignee" />
            <TextInput name="licenseCompany" label="License company" /> */}
            <Field name="licenseType">
              {({ field, form: { touched, errors }, meta }) => (
                <SelectInput
                  {...field}
                  label="License type"
                  helperText={meta.touched && meta.error}
                  error={meta.touched && Boolean(meta.error)}
                  options={
                    artwork.current && artwork.current.license === 'commercial'
                      ? [
                          {
                            value: 'personal',
                            text: 'Personal',
                          },
                          {
                            value: 'commercial',
                            text: 'Commercial',
                          },
                        ]
                      : [
                          {
                            value: 'personal',
                            text: 'Personal',
                          },
                        ]
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                />
              )}
            </Field>
            <List component="nav" aria-label="Features">
              {licenseOptions.map((item) => (
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Grid>
          {/*           <Box display="flex" justifyContent="space-between">
            <Button disabled={true} className={classes.button}>
              Back
            </Button>
            <Button
              onClick={() => handleNextClick(values)}
              variant="contained"
              color="primary"
              className={classes.button}
              type="button"
              disabled={!license}
            >
              {state.loading ? (
                <CircularProgress color="secondary" size={24} />
              ) : (
                'Next'
              )}
            </Button>
          </Box> */}
          {/*               </Form>
            )}
          </Formik> */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LicenseForm;
