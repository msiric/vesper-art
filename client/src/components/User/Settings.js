import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import SelectInput from '../../shared/SelectInput/SelectInput';
import { useFormik, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Gallery from '../Home/Gallery';
import {
  Modal,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  ListItemSecondaryAction,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Paper,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Popover,
  Chip,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ListItemIcon,
  ListSubheader,
  Switch,
  Link as Anchor,
} from '@material-ui/core';
import {
  CheckCircleRounded as ConfirmIcon,
  MoreVertRounded as MoreIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  CancelRounded as CancelIcon,
  ExpandLessRounded as UpIcon,
  ExpandLessRounded as DownIcon,
  FavoriteRounded as SaveIcon,
  ShareRounded as ShareIcon,
  ShoppingBasketRounded as PurchaseIcon,
  LinkRounded as CopyIcon,
  EmailRounded as EmailIcon,
  DoneRounded as CheckIcon,
  RemoveCircleRounded as DeactivateIcon,
} from '@material-ui/icons';
import AutocompleteInput from '../../shared/AutocompleteInput/AutocompleteInput';
import { Link, useHistory } from 'react-router-dom';
import ax from '../../axios.config';
import SettingsStyles from './Settings.style';

const emailValidation = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .trim()
    .required('Email cannot be empty'),
});

const passwordValidation = Yup.object().shape({
  current: Yup.string().required('Enter your password'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Enter new password'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

const preferencesValidation = Yup.object().shape({
  displaySaves: Yup.boolean().required('Saves need to have a value'),
});

const billingValidation = Yup.object().shape({
  firstname: Yup.string().trim().required('First name is required'),
  lastname: Yup.string().trim().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  address: Yup.string().trim().required('Address is required'),
  zip: Yup.string().trim().required('Postal code is required'),
  city: Yup.string().trim().required('City is required'),
  country: Yup.string().trim().required('Country is required'),
});

const licenseValidation = Yup.object().shape({
  licenseType: Yup.string()
    .matches(/(personal|commercial)/)
    .required('License type is required'),
  licenseeName: Yup.string()
    .trim()
    .required('License holder full name is required'),
  licenseeCompany: Yup.string()
    .notRequired()
    .when('commercial', {
      is: 'commercial',
      then: Yup.string().trim().required('License holder company is required'),
    }),
});

const Settings = () => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    user: {},
    panel: {
      expanded: '',
    },
  });
  const history = useHistory();

  const classes = SettingsStyles();

  const fetchSettings = async () => {
    try {
      const { data } = await ax.get(`/api/user/${store.user.id}/settings`);
      setState({
        ...state,
        loading: false,
        user: data.user,
        panel: {
          expanded: 'panel1',
        },
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handlePanelChange = (visible) => (e, isExpanded) => {
    setState((prevState) => ({
      ...prevState,
      // panel: { ...prevState.panel, expanded: isExpanded ? visible : '' },
      panel: { ...prevState.panel, expanded: visible },
    }));
  };

  const handleDeactivateUser = async () => {
    await ax.delete(`/api/user/${store.user.id}`);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.user._id ? (
          <Grid item sm={12} className={classes.grid}>
            <Paper className={classes.artwork} variant="outlined">
              <Typography variant="h6" align="center">
                Settings
              </Typography>
              <div className={classes.root}>
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel1'}
                  onChange={handlePanelChange('panel1')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel1' ? (
                        <UpIcon />
                      ) : (
                        <DownIcon />
                      )
                    }
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography className={classes.heading}>
                      Change email address
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      {state.user.email}{' '}
                      {state.user.verified ? (
                        <Chip
                          label="Verified"
                          clickable
                          color="primary"
                          onDelete={() => null}
                          deleteIcon={<CheckIcon />}
                        />
                      ) : (
                        <Chip
                          label="Not verified"
                          clickable
                          color="error"
                          onDelete={() => null}
                        />
                      )}
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Formik
                      initialValues={{
                        email: '',
                      }}
                      enableReinitialize
                      validationSchema={emailValidation}
                      onSubmit={async (values, { resetForm }) => {
                        const { data } = await ax.patch(
                          `/api/user/${store.user.id}/update_email`,
                          values
                        );

                        setState((prevState) => ({
                          ...prevState,
                          user: {
                            ...prevState.user,
                            email: values.email,
                            verified: false,
                          },
                        }));
                        resetForm();
                      }}
                    >
                      {({ values, errors, touched }) => (
                        <Form className={classes.updateEmail}>
                          <div>
                            <Field name="email">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  onBlur={() => null}
                                  label="Update email address"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                />
                              )}
                            </Field>
                          </div>
                          <div>
                            <Button type="submit" color="primary" fullWidth>
                              Update
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel2'}
                  onChange={handlePanelChange('panel2')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel2' ? (
                        <UpIcon />
                      ) : (
                        <DownIcon />
                      )
                    }
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <Typography className={classes.heading}>
                      Change password
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      *********
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Formik
                      initialValues={{
                        current: '',
                        password: '',
                        confirmPassword: '',
                      }}
                      enableReinitialize
                      validationSchema={passwordValidation}
                      onSubmit={async (values, { resetForm }) => {
                        const { data } = await ax.patch(
                          `/api/user/${store.user.id}/update_password`,
                          values
                        );
                        resetForm();
                      }}
                    >
                      {({ values, errors, touched }) => (
                        <Form className={classes.updatePassword}>
                          <div>
                            <Field name="current">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  onBlur={() => null}
                                  label="Enter current password"
                                  type="password"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                />
                              )}
                            </Field>
                            <Field name="password">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  onBlur={() => null}
                                  label="Enter new password"
                                  type="password"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                />
                              )}
                            </Field>
                            <Field name="confirmPassword">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  onBlur={() => null}
                                  label="Confirm password"
                                  type="password"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                />
                              )}
                            </Field>
                          </div>
                          <div>
                            <Button type="submit" color="primary" fullWidth>
                              Update
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel3'}
                  onChange={handlePanelChange('panel3')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel3' ? (
                        <UpIcon />
                      ) : (
                        <DownIcon />
                      )
                    }
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                  >
                    <Typography className={classes.heading}>
                      Preferences
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      Change saved artwork visibility
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.column}>
                    <List
                      subheader={
                        <ListSubheader>Display publicly:</ListSubheader>
                      }
                      className={classes.list}
                    >
                      <Formik
                        initialValues={{
                          displaySaves: state.user.displaySaves,
                        }}
                        enableReinitialize
                        validationSchema={preferencesValidation}
                        onSubmit={async (values, { resetForm }) => {
                          await ax.patch(
                            `/api/user/${store.user.id}/preferences`,
                            values
                          );
                          setState((prevState) => ({
                            ...prevState,
                            user: {
                              ...prevState.user,
                              displaySaves: values.displaySaves,
                            },
                          }));
                          resetForm();
                        }}
                      >
                        {({ values, errors, touched }) => (
                          <Form className={classes.updatePassword}>
                            <div>
                              <ListItem>
                                <ListItemIcon>
                                  <SaveIcon />
                                </ListItemIcon>
                                <ListItemText
                                  id="switch-list-label-saves"
                                  primary="Saved artwork"
                                />
                                <ListItemSecondaryAction>
                                  <Field name="displaySaves">
                                    {({
                                      field,
                                      form: { setFieldValue, touched, errors },
                                      meta,
                                    }) => (
                                      <Switch
                                        {...field}
                                        edge="end"
                                        onChange={(e) =>
                                          setFieldValue(
                                            'displaySaves',
                                            e.target.checked
                                          )
                                        }
                                        checked={values.displaySaves}
                                        inputProps={{
                                          'aria-labelledby':
                                            'switch-list-label-saves',
                                        }}
                                      />
                                    )}
                                  </Field>
                                </ListItemSecondaryAction>
                              </ListItem>
                            </div>
                            <div>
                              <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<ConfirmIcon />}
                                fullWidth
                              >
                                Update
                              </Button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel4'}
                  onChange={handlePanelChange('panel4')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel4' ? (
                        <UpIcon />
                      ) : (
                        <DownIcon />
                      )
                    }
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                  >
                    <Typography className={classes.heading}>
                      Billing information
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      Change billing information
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Formik
                      initialValues={{
                        firstname: '',
                        lastname: '',
                        email: '',
                        address: '',
                        zip: '',
                        city: '',
                        country: '',
                      }}
                      enableReinitialize
                      validationSchema={billingValidation}
                      onSubmit={async (values, { resetForm }) => {
                        await ax.patch(
                          `/api/user/${store.user.id}/billing`,
                          values
                        );
                        setState((prevState) => ({
                          ...prevState,
                          user: {
                            ...prevState.user,
                            billingInformation: values,
                          },
                        }));
                        resetForm();
                      }}
                    >
                      {({ values, errors, touched, enableReinitialize }) => (
                        <Form>
                          <Grid item xs={12}>
                            <Field name="firstname">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="First name"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="lastname">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="Last name"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="email">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="Email"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="address">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="Street address"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="zip">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="Postal code"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="city">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="City"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="country">
                              {({
                                field,
                                form: {
                                  touched,
                                  errors,
                                  setFieldValue,
                                  setFieldTouched,
                                },
                                meta,
                              }) => (
                                <AutocompleteInput
                                  {...field}
                                  options={countries}
                                  handleChange={(e, value) =>
                                    setFieldValue('country', value || '')
                                  }
                                  handleBlur={() =>
                                    setFieldTouched('country', true)
                                  }
                                  getOptionLabel={(option) => option.name}
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  label="Country"
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid container item justify="flex-end">
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              type="submit"
                            >
                              Save
                            </Button>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel5'}
                  onChange={handlePanelChange('panel5')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel5' ? (
                        <UpIcon />
                      ) : (
                        <DownIcon />
                      )
                    }
                    aria-controls="panel5bh-content"
                    id="panel5bh-header"
                  >
                    <Typography className={classes.heading}>
                      License templates
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      Change license templates
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Formik
                      initialValues={{
                        licenseType: 'personal',
                        licenseeName: '',
                        licenseeCompany: '',
                      }}
                      enableReinitialize
                      validationSchema={licenseValidation}
                      onSubmit={async (values, { resetForm }) => {
                        await ax.patch(
                          `/api/user/${store.user.id}/templates`,
                          values
                        );
                        setState((prevState) => ({
                          ...prevState,
                          user: {
                            ...prevState.user,
                            licenseTemplates: values,
                          },
                        }));
                        resetForm();
                      }}
                    >
                      {({ values, errors, touched, enableReinitialize }) => (
                        <Form>
                          <Grid item xs={12}>
                            <Field name="firstname">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="First name"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="lastname">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="Last name"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="email">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="Email"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="address">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="Street address"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="zip">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="Postal code"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="city">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  label="City"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Field name="country">
                              {({
                                field,
                                form: {
                                  touched,
                                  errors,
                                  setFieldValue,
                                  setFieldTouched,
                                },
                                meta,
                              }) => (
                                <AutocompleteInput
                                  {...field}
                                  options={countries}
                                  handleChange={(e, value) =>
                                    setFieldValue('country', value || '')
                                  }
                                  handleBlur={() =>
                                    setFieldTouched('country', true)
                                  }
                                  getOptionLabel={(option) => option.name}
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  label="Country"
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid container item justify="flex-end">
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              type="submit"
                            >
                              Save
                            </Button>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel6'}
                  onChange={handlePanelChange('panel6')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel6' ? (
                        <UpIcon />
                      ) : (
                        <DownIcon />
                      )
                    }
                    aria-controls="panel6bh-content"
                    id="panel6bh-header"
                  >
                    <Typography className={classes.heading}>
                      Account settings
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      Deactivate account
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>Deactivate account</Typography>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      className={classes.button}
                      startIcon={<DeactivateIcon />}
                      onClick={handleDeactivateUser}
                      fullWidth
                    >
                      Deactivate
                    </Button>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            </Paper>
          </Grid>
        ) : (
          history.push('/')
        )}
      </Grid>
    </Container>
  );
};

const countries = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Åland Islands', code: 'AX' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'American Samoa', code: 'AS' },
  { name: 'AndorrA', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Anguilla', code: 'AI' },
  { name: 'Antarctica', code: 'AQ' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Aruba', code: 'AW' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bermuda', code: 'BM' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Bouvet Island', code: 'BV' },
  { name: 'Brazil', code: 'BR' },
  { name: 'British Indian Ocean Territory', code: 'IO' },
  { name: 'Brunei Darussalam', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Cape Verde', code: 'CV' },
  { name: 'Cayman Islands', code: 'KY' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Christmas Island', code: 'CX' },
  { name: 'Cocos (Keeling) Islands', code: 'CC' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Congo, The Democratic Republic of the', code: 'CD' },
  { name: 'Cook Islands', code: 'CK' },
  { name: 'Costa Rica', code: 'CR' },
  { name: "Cote D'Ivoire", code: 'CI' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Falkland Islands (Malvinas)', code: 'FK' },
  { name: 'Faroe Islands', code: 'FO' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'French Guiana', code: 'GF' },
  { name: 'French Polynesia', code: 'PF' },
  { name: 'French Southern Territories', code: 'TF' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Gibraltar', code: 'GI' },
  { name: 'Greece', code: 'GR' },
  { name: 'Greenland', code: 'GL' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guadeloupe', code: 'GP' },
  { name: 'Guam', code: 'GU' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guernsey', code: 'GG' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
  { name: 'Holy See (Vatican City State)', code: 'VA' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran, Islamic Republic Of', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Isle of Man', code: 'IM' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jersey', code: 'JE' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: "Korea, Democratic People'S Republic of", code: 'KP' },
  { name: 'Korea, Republic of', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: "Lao People'S Democratic Republic", code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libyan Arab Jamahiriya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Macao', code: 'MO' },
  { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Martinique', code: 'MQ' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mayotte', code: 'YT' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia, Federated States of', code: 'FM' },
  { name: 'Moldova, Republic of', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montserrat', code: 'MS' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Netherlands Antilles', code: 'AN' },
  { name: 'New Caledonia', code: 'NC' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Niue', code: 'NU' },
  { name: 'Norfolk Island', code: 'NF' },
  { name: 'Northern Mariana Islands', code: 'MP' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Palestinian Territory, Occupied', code: 'PS' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Pitcairn', code: 'PN' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Reunion', code: 'RE' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russian Federation', code: 'RU' },
  { name: 'RWANDA', code: 'RW' },
  { name: 'Saint Helena', code: 'SH' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Pierre and Miquelon', code: 'PM' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia and Montenegro', code: 'CS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Svalbard and Jan Mayen', code: 'SJ' },
  { name: 'Swaziland', code: 'SZ' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syrian Arab Republic', code: 'SY' },
  { name: 'Taiwan, Province of China', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania, United Republic of', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tokelau', code: 'TK' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Turks and Caicos Islands', code: 'TC' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'United States Minor Outlying Islands', code: 'UM' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Viet Nam', code: 'VN' },
  { name: 'Virgin Islands, British', code: 'VG' },
  { name: 'Virgin Islands, U.S.', code: 'VI' },
  { name: 'Wallis and Futuna', code: 'WF' },
  { name: 'Western Sahara', code: 'EH' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
];

export default Settings;
