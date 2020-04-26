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
  FavoriteRounded as SaveIcon,
  ShareRounded as ShareIcon,
  ShoppingBasketRounded as PurchaseIcon,
  LinkRounded as CopyIcon,
  EmailRounded as EmailIcon,
  DoneRounded as CheckIcon,
  RemoveCircleRounded as DeactivateIcon,
} from '@material-ui/icons';
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
  displayPurchases: Yup.boolean().required('Purchases need to have a value'),
  displaySaves: Yup.boolean().required('Saves need to have a value'),
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
          expanded: false,
        },
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handlePanelChange = (visible) => (e, isExpanded) => {
    setState((prevState) => ({
      ...prevState,
      panel: { ...prevState.panel, expanded: isExpanded ? visible : '' },
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
                        <CancelIcon />
                      ) : (
                        <EditIcon />
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
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel2'}
                  onChange={handlePanelChange('panel2')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel2' ? (
                        <CancelIcon />
                      ) : (
                        <EditIcon />
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
                        <CancelIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                  >
                    <Typography className={classes.heading}>
                      Preferences
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      Change purchases and saved artwork visibility
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
                          displayPurchases: state.user.displayPurchases,
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
                              displayPurchases: values.displayPurchases,
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
                                  <PurchaseIcon />
                                </ListItemIcon>
                                <ListItemText
                                  id="switch-list-label-purchases"
                                  primary="Purchases"
                                />
                                <ListItemSecondaryAction>
                                  <Field name="displayPurchases">
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
                                            'displayPurchases',
                                            e.target.checked
                                          )
                                        }
                                        checked={values.displayPurchases}
                                        inputProps={{
                                          'aria-labelledby':
                                            'switch-list-label-purchases',
                                        }}
                                      />
                                    )}
                                  </Field>
                                </ListItemSecondaryAction>
                              </ListItem>
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
                        <CancelIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                  >
                    <Typography className={classes.heading}>
                      Payment and billing
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      Change payment method and billing information
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      Change payment method and billing information
                    </Typography>
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
                        <CancelIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    aria-controls="panel5bh-content"
                    id="panel4bh-header"
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

export default Settings;
