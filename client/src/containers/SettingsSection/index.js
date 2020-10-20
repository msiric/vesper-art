import {
  Box,
  Button,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { Field, Form, Formik } from "formik";
import React from "react";
import { countries } from "../../../../common/constants.js";
import AutocompleteInput from "../../components/AutocompleteInput/AutocompleteInput.js";
import ImageInput from "../../components/ImageInput/ImageInput.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";
import SwitchInput from "../../components/SwitchInput/SwitchInput.js";
import { emailValidation } from "../../validation/email.js";
import { patchAvatar } from "../../validation/media.js";
import { passwordValidation } from "../../validation/password.js";
import { preferencesValidation } from "../../validation/preferences.js";
import { profileValidation } from "../../validation/profile.js";
import settingsSectionStyles from "./styles.js";

const SettingsSection = ({
  user,
  handleUpdateProfile,
  handleUpdateEmail,
  handleUpdatePreferences,
  handleUpdatePassword,
  handleDeactivateUser,
  loading,
}) => {
  const classes = settingsSectionStyles();

  return (
    <Grid container p={0} my={4} spacing={2}>
      <Grid
        item
        xs={12}
        md={4}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card
          className={classes.artworkContainer}
          style={{
            height: "100%",
          }}
        >
          <Formik
            initialValues={{
              userMedia: "",
              userDescription: user.description || "",
              userCountry: user.country
                ? countries.find((country) => country.value === user.country)
                : "",
            }}
            validationSchema={profileValidation.concat(patchAvatar)}
            enableReinitialize
            onSubmit={handleUpdateProfile}
          >
            {({ values, errors, touched }) => (
              <Form
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent
                  p={32}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 20,
                    }}
                  >
                    <Field name="userMedia">
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
                          loading={loading}
                        />
                      )}
                    </Field>
                  </Box>
                  <Box>
                    <SkeletonWrapper variant="text" loading={loading}>
                      <Typography>Profile details</Typography>
                    </SkeletonWrapper>
                    <SkeletonWrapper
                      variant="text"
                      loading={loading}
                      width="100%"
                    >
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
                    </SkeletonWrapper>
                    <SkeletonWrapper
                      variant="text"
                      loading={loading}
                      width="100%"
                    >
                      <Field name="userCountry">
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
                            handleChange={(e, item) =>
                              setFieldValue("userCountry", item || "")
                            }
                            handleBlur={() =>
                              setFieldTouched("userCountry", true)
                            }
                            getOptionLabel={(option) => option.text}
                            helperText={meta.touched && meta.error}
                            error={meta.touched && Boolean(meta.error)}
                            label="Country"
                          />
                        )}
                      </Field>
                    </SkeletonWrapper>
                  </Box>
                </CardContent>
                <CardActions
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <SkeletonWrapper loading={loading}>
                    <Button type="submit" variant="outlined">
                      Save
                    </Button>
                  </SkeletonWrapper>
                </CardActions>
              </Form>
            )}
          </Formik>
        </Card>
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card
          className={classes.artworkContainer}
          style={{ marginBottom: "16px" }}
        >
          <Formik
            initialValues={{
              userEmail: user.email,
            }}
            validationSchema={emailValidation}
            enableReinitialize
            onSubmit={handleUpdateEmail}
          >
            {({ values, errors, touched }) => (
              <Form>
                <CardContent p={32}>
                  <SkeletonWrapper variant="text" loading={loading}>
                    <Typography>Profile settings</Typography>
                  </SkeletonWrapper>
                  <SkeletonWrapper
                    variant="text"
                    loading={loading}
                    width="100%"
                  >
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
                  </SkeletonWrapper>
                </CardContent>
                <CardActions
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <SkeletonWrapper loading={loading}>
                    <Button type="submit" variant="outlined">
                      Save
                    </Button>
                  </SkeletonWrapper>
                </CardActions>
              </Form>
            )}
          </Formik>
        </Card>

        <Card
          className={classes.artworkContainer}
          style={{ marginBottom: "16px" }}
        >
          <Formik
            initialValues={{
              userSaves: loading ? false : user.displaySaves,
            }}
            enableReinitialize
            validationSchema={preferencesValidation}
            onSubmit={handleUpdatePreferences}
          >
            {({ values, errors, touched }) => (
              <Form>
                <CardContent p={32}>
                  <SkeletonWrapper variant="text" loading={loading}>
                    <Typography>Profile preferences</Typography>
                  </SkeletonWrapper>
                  <SkeletonWrapper
                    variant="text"
                    loading={loading}
                    width="100%"
                  >
                    <Field name="userSaves">
                      {({
                        field,
                        form: { setFieldValue, touched, errors, helperText },
                        meta,
                      }) => (
                        <SwitchInput
                          {...field}
                          color="primary"
                          label="Display saved artwork"
                          helperText={meta.touched && meta.error}
                          error={meta.touched && Boolean(meta.error)}
                        />
                      )}
                    </Field>
                  </SkeletonWrapper>
                </CardContent>
                <CardActions
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <SkeletonWrapper loading={loading}>
                    <Button type="submit" variant="outlined">
                      Save
                    </Button>
                  </SkeletonWrapper>
                </CardActions>
              </Form>
            )}
          </Formik>
        </Card>
        <Card className={classes.artworkContainer}>
          <Formik
            initialValues={{
              userCurrent: "",
              userPassword: "",
              userConfirm: "",
            }}
            validationSchema={passwordValidation}
            enableReinitialize
            onSubmit={handleUpdatePassword}
          >
            {({ values, errors, touched }) => (
              <Form>
                <CardContent p={32}>
                  <SkeletonWrapper variant="text" loading={loading}>
                    <Typography>Profile settings</Typography>
                  </SkeletonWrapper>
                  <SkeletonWrapper
                    variant="text"
                    loading={loading}
                    width="100%"
                  >
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
                  </SkeletonWrapper>
                  <SkeletonWrapper
                    variant="text"
                    loading={loading}
                    width="100%"
                  >
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
                  </SkeletonWrapper>
                  <SkeletonWrapper
                    variant="text"
                    loading={loading}
                    width="100%"
                  >
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
                  </SkeletonWrapper>
                </CardContent>
                <CardActions
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <SkeletonWrapper loading={loading}>
                    <Button type="submit" variant="outlined">
                      Save
                    </Button>
                  </SkeletonWrapper>
                </CardActions>
              </Form>
            )}
          </Formik>
        </Card>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card className={classes.artworkContainer}>
          <CardContent p={32}>
            <SkeletonWrapper variant="text" loading={loading}>
              <Typography>Deactivate user</Typography>
            </SkeletonWrapper>
            <SkeletonWrapper variant="text" loading={loading} width="100%">
              <Typography>
                Deactivating your account will result in all your data being
                deleted, except for essential artwork information (if you have
                any sold artwork as a seller) and essential license information
                (if you have any purchased artwork as a buyer) that are parts of
                other users' orders. This action is irreversible.
              </Typography>
            </SkeletonWrapper>
          </CardContent>
          <CardActions style={{ display: "flex", justifyContent: "flex-end" }}>
            <SkeletonWrapper loading={loading}>
              <Button variant="outlined" onClick={handleDeactivateUser}>
                Deactivate
              </Button>
            </SkeletonWrapper>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SettingsSection;
