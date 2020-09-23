import {
  Button,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { countries } from '../../../../common/constants.js';
import ImageInput from '../../components/ImageInput/ImageInput.js';
import SelectInput from '../../components/SelectInput/SelectInput.js';

const useStyles = makeStyles((theme) => ({}));

const SettingsSection = ({ user, handleDeactivateUser }) => {
  const classes = useStyles();

  return (
    <Card className={classes.artworkContainer}>
      <CardContent p={32}>
        <Formik
          initialValues={{
            userAvatar: '',
            userDescription: user.description,
            userCountry: user.country || '',
            userEmail: user.email,
            userSaves: user.displaySaves,
            userCurrent: '',
            userPassword: '',
            userRepeat: '',
          }}
          enableReinitialize
          onSubmit={async (values, { resetForm }) => {
            /*         await patchEmail({
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
        resetForm(); */
          }}
        >
          {({ values, errors, touched }) => (
            <Form>
              <Grid container p={0} my={4}>
                <Grid
                  item
                  xs={12}
                  md={5}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Field name="userAvatar">
                    {({
                      field,
                      form: { setFieldValue, setFieldTouched },
                      meta,
                    }) => (
                      <ImageInput
                        title="Avatar"
                        meta={meta}
                        field={field}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        helperText={meta.touched && meta.error}
                        error={meta.touched && Boolean(meta.error)}
                        preview={user.photo}
                        shape="circle"
                        noEmpty={true}
                      />
                    )}
                  </Field>
                  <Typography variant="h4" mb={4}>
                    Deactivate account
                  </Typography>
                  <Typography color="textSecondary" mb={4}>
                    Deactivating your account will result in all your data being
                    deleted, except for essential artwork information (if you
                    have any sold artwork as a seller) and essential license
                    information (if you have any purchased artwork as a buyer)
                    that are parts of other users' orders. This action is
                    irreversible.
                  </Typography>
                  <Button>Deactivate account</Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={7}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <Typography>Profile details</Typography>
                  <Field name="userDescription">
                    {({ field, form: { touched, errors }, meta }) => (
                      <TextField
                        {...field}
                        onBlur={() => null}
                        label="Description"
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
                  <Field name="userCountry">
                    {({ field, form: { touched, errors }, meta }) => (
                      <SelectInput
                        {...field}
                        label="Country"
                        helperText={meta.touched && meta.error}
                        error={meta.touched && Boolean(meta.error)}
                        options={countries}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </Field>
                  <Divider />
                  <Typography>Profile preferences</Typography>
                  <Field name="userSaves">
                    {({
                      field,
                      form: { setFieldValue, touched, errors },
                      meta,
                    }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            edge="end"
                            label="Display saved artwork"
                            onChange={(e) =>
                              setFieldValue('userSaves', e.target.checked)
                            }
                            checked={values.userSaves}
                            inputProps={{
                              'aria-labelledby': 'switch-list-label-saves',
                            }}
                          />
                        }
                        labelPlacement="start"
                        label="Display favorite artwork"
                      />
                    )}
                  </Field>
                  <Divider />
                  <Typography>Profile settings</Typography>
                  <Field name="userEmail">
                    {({ field, form: { touched, errors }, meta }) => (
                      <TextField
                        {...field}
                        onBlur={() => null}
                        label="Email address"
                        type="email"
                        helperText={meta.touched && meta.error}
                        error={meta.touched && Boolean(meta.error)}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </Field>
                  <Field name="userCurrent">
                    {({ field, form: { touched, errors }, meta }) => (
                      <TextField
                        {...field}
                        onBlur={() => null}
                        label="Current password"
                        type="password"
                        helperText={meta.touched && meta.error}
                        error={meta.touched && Boolean(meta.error)}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </Field>
                  <Field name="userPassword">
                    {({ field, form: { touched, errors }, meta }) => (
                      <TextField
                        {...field}
                        onBlur={() => null}
                        label="New password"
                        type="password"
                        helperText={meta.touched && meta.error}
                        error={meta.touched && Boolean(meta.error)}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </Field>
                  <Field name="userConfirm">
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
                  <div>
                    <Button type="submit" color="primary" fullWidth>
                      Update
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default SettingsSection;
