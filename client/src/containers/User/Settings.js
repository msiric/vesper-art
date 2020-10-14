import {
  Button,
  Chip,
  Container,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  CheckCircleRounded as ConfirmIcon,
  DoneRounded as CheckIcon,
  ExpandLessRounded as DownIcon,
  ExpandLessRounded as UpIcon,
  FavoriteRounded as SaveIcon,
  RemoveCircleRounded as DeactivateIcon,
} from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import {
  deleteUser,
  getSettings,
  patchBilling,
  patchEmail,
  patchPassword,
  patchPreferences,
} from "../../services/user.js";
import AutocompleteInput from "../../shared/AutocompleteInput/AutocompleteInput.js";
import { billingValidation } from "../../validation/billing.js";
import { emailValidation } from "../../validation/email.js";
import { passwordValidation } from "../../validation/password.js";
import { preferencesValidation } from "../../validation/preferences.js";
import { Context } from "../Store/Store.js";
import SettingsStyles from "./Settings.style.js";

const Settings = () => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    user: {},
    panel: {
      expanded: "",
    },
  });
  const history = useHistory();

  const classes = SettingsStyles();

  const fetchSettings = async () => {
    try {
      const { data } = await getSettings({ userId: store.user.id });
      setState({
        ...state,
        loading: false,
        user: data.user,
        panel: {
          expanded: "panel1",
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
    await deleteUser({ userId: store.user.id });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Container className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <LoadingSpinner />
          </Grid>
        ) : state.user._id ? (
          <Grid item sm={12} className={classes.grid}>
            <Paper className={classes.artwork} variant="outlined">
              <Typography variant="h6" align="center">
                Settings
              </Typography>
              <div className={classes.root}>
                <ExpansionPanel
                  expanded={state.panel.expanded === "panel1"}
                  onChange={handlePanelChange("panel1")}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === "panel1" ? (
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
                      {state.user.email}{" "}
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
                        email: "",
                      }}
                      enableReinitialize
                      validationSchema={emailValidation}
                      onSubmit={async (values, { resetForm }) => {
                        await patchEmail({
                          userId: store.user.id,
                          data: values,
                        });

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
                  expanded={state.panel.expanded === "panel2"}
                  onChange={handlePanelChange("panel2")}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === "panel2" ? (
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
                        current: "",
                        password: "",
                        confirm: "",
                      }}
                      enableReinitialize
                      validationSchema={passwordValidation}
                      onSubmit={async (values, { resetForm }) => {
                        await patchPassword({
                          userId: store.user.id,
                          data: values,
                        });
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
                            <Field name="confirm">
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
                  expanded={state.panel.expanded === "panel3"}
                  onChange={handlePanelChange("panel3")}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === "panel3" ? (
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
                          await patchPreferences({
                            userId: store.user.id,
                            data: values,
                          });
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
                                            "displaySaves",
                                            e.target.checked
                                          )
                                        }
                                        checked={values.displaySaves}
                                        inputProps={{
                                          "aria-labelledby":
                                            "switch-list-label-saves",
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
                                variant="outlined"
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
                  expanded={state.panel.expanded === "panel4"}
                  onChange={handlePanelChange("panel4")}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === "panel4" ? (
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
                        firstname: "",
                        lastname: "",
                        email: "",
                        address: "",
                        zip: "",
                        city: "",
                        country: "",
                      }}
                      enableReinitialize
                      validationSchema={billingValidation}
                      onSubmit={async (values, { resetForm }) => {
                        await patchBilling({
                          userId: store.user.id,
                          data: values,
                        });
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
                                    setFieldValue("country", value || "")
                                  }
                                  handleBlur={() =>
                                    setFieldTouched("country", true)
                                  }
                                  getOptionLabel={(option) => option.text}
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  label="Country"
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid container item justify="flex-end">
                            <Button
                              variant="outlined"
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
                  expanded={state.panel.expanded === "panel6"}
                  onChange={handlePanelChange("panel6")}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === "panel6" ? (
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
                      variant="outlined"
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
          history.push("/")
        )}
      </Grid>
    </Container>
  );
};

export default Settings;
