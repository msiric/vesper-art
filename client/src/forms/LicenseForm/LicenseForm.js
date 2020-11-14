import { Box, Button, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import { Container, Grid } from "../../styles/theme.js";
import { licenseValidation } from "../../validation/license.js";

const LicenseFormStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: "100%",
  },
  container: {
    flex: 1,
    height: "100%",
  },
  artwork: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  root: {
    display: "flex",
    width: "100%",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  details: {
    display: "flex",
    width: "100%",
  },
  cover: {
    minWidth: 50,
    maxWidth: 200,
    width: "100%",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
    width: "100%",
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  rightList: {
    textAlign: "right",
  },
  manageLicenses: {
    padding: "8px 16px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
}));

const changeLicense = (target, setFieldValue) =>
  setFieldValue(target.name, target.value);

const LicenseForm = ({
  version,
  handleLicenseChange = changeLicense,
  initial = { standalone: false, value: "personal", submit: () => null },
  handleModalClose = () => null,
  loading,
}) => {
  const [state, setState] = useState({ loading: false });
  const classes = LicenseFormStyles();

  return (
    <Container p={2}>
      <Grid container>
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography variant="h5">License information</Typography>
        </SkeletonWrapper>
        <Grid item xs={12} className={classes.actions}>
          {initial.standalone ? (
            <Formik
              initialValues={{
                licenseType: initial.value,
                licenseAssignee: "",
                licenseCompany: "",
              }}
              enableReinitialize
              validationSchema={licenseValidation}
              onSubmit={initial.submit}
            >
              {({
                isSubmitting,
                values,
                errors,
                touched,
                enableReinitialize,
              }) => (
                <Form style={{ width: "100%" }}>
                  <Grid item xs={12}>
                    <SkeletonWrapper
                      variant="text"
                      loading={loading}
                      width="100%"
                    >
                      <Field name="licenseAssignee">
                        {({ field, form: { touched, errors }, meta }) => (
                          <TextField
                            {...field}
                            type="text"
                            label="License assignee"
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
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
                      <Field name="licenseCompany">
                        {({ field, form: { touched, errors }, meta }) => (
                          <TextField
                            {...field}
                            type="text"
                            label="License company"
                            error={meta.touched && meta.error}
                            helperText={meta.touched && meta.error}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      </Field>
                    </SkeletonWrapper>
                    {/*             <TextInput name="licenseAssignee" label="License assignee" />
            <TextInput name="licenseCompany" label="License company" /> */}
                    <SkeletonWrapper
                      variant="text"
                      loading={loading}
                      width="100%"
                    >
                      <Field name="licenseType">
                        {({
                          field,
                          form: { touched, errors, setFieldValue },
                          meta,
                        }) => (
                          <SelectInput
                            {...field}
                            label="License type"
                            helperText={meta.touched && meta.error}
                            error={meta.touched && Boolean(meta.error)}
                            onChange={(e) =>
                              handleLicenseChange(e.target, setFieldValue)
                            }
                            options={
                              version.license === "personal"
                                ? [
                                    {
                                      value: "personal",
                                      text: "Personal",
                                    },
                                  ]
                                : version.use === "included"
                                ? [
                                    {
                                      value: "commercial",
                                      text: "Commercial",
                                    },
                                  ]
                                : [
                                    {
                                      value: "personal",
                                      text: "Personal",
                                    },
                                    {
                                      value: "commercial",
                                      text: "Commercial",
                                    },
                                  ]
                            }
                            margin="dense"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      </Field>
                    </SkeletonWrapper>
                  </Grid>
                  <Box display="flex" justifyContent="space-between">
                    <SkeletonWrapper loading={loading}>
                      <Button
                        type="submit"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        Download
                      </Button>
                    </SkeletonWrapper>
                    <SkeletonWrapper loading={loading}>
                      <Button
                        type="button"
                        color="warning"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </Button>
                    </SkeletonWrapper>
                  </Box>
                </Form>
              )}
            </Formik>
          ) : (
            <Grid item xs={12}>
              <SkeletonWrapper variant="text" loading={loading} width="100%">
                <Field name="licenseAssignee">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      type="text"
                      label="License assignee"
                      error={meta.touched && meta.error}
                      helperText={meta.touched && meta.error}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                </Field>
              </SkeletonWrapper>
              <SkeletonWrapper variant="text" loading={loading} width="100%">
                <Field name="licenseCompany">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      type="text"
                      label="License company"
                      error={meta.touched && meta.error}
                      helperText={meta.touched && meta.error}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                </Field>
              </SkeletonWrapper>
              {/*             <TextInput name="licenseAssignee" label="License assignee" />
            <TextInput name="licenseCompany" label="License company" /> */}
              <SkeletonWrapper variant="text" loading={loading} width="100%">
                <Field name="licenseType">
                  {({
                    field,
                    form: { touched, errors, setFieldValue },
                    meta,
                  }) => (
                    <SelectInput
                      {...field}
                      label="License type"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      onChange={(e) =>
                        handleLicenseChange(e.target, setFieldValue)
                      }
                      options={
                        version.license === "personal"
                          ? [
                              {
                                value: "personal",
                                text: "Personal",
                              },
                            ]
                          : version.use === "included"
                          ? [
                              {
                                value: "commercial",
                                text: "Commercial",
                              },
                            ]
                          : [
                              {
                                value: "personal",
                                text: "Personal",
                              },
                              {
                                value: "commercial",
                                text: "Commercial",
                              },
                            ]
                      }
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                </Field>
              </SkeletonWrapper>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LicenseForm;

{
  /* <Box>
  <TextInput
    name="licenseAssignee"
    type="text"
    label="License assignee"
    errors={errors}
  />
  <TextInput
    name="licenseCompany"
    type="text"
    label="License company"
    errors={errors}
  />
  <SelectInput
    name="licenseType"
    label="License type"
    errors={errors}
    options={
      version.license === "personal"
        ? [
            {
              value: "personal",
              text: "Personal",
            },
          ]
        : version.use === "included"
        ? [
            {
              value: "commercial",
              text: "Commercial",
            },
          ]
        : [
            {
              value: "personal",
              text: "Personal",
            },
            {
              value: "commercial",
              text: "Commercial",
            },
          ]
    }
  />
  <AsyncButton
    type="submit"
    fullWidth
    variant="outlined"
    color="primary"
    padding
    loading={formState.isSubmitting}
  >
    Update
  </AsyncButton>
</Box>;
 */
}
