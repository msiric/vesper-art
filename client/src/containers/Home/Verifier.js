import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { withSnackbar } from "notistack";
import React, { useState } from "react";
import * as Yup from "yup";
import { formatDate } from "../../../../common/helpers.js";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import { postVerifier } from "../../services/home.js";
import VerifierStyles from "./Verifier.style.js";

const fingerprintValidation = Yup.object().shape({
  fingerprint: Yup.string().trim().required("Fingerprint cannot be empty"),
});

const Verifier = () => {
  const [state, setState] = useState({
    loading: false,
    license: {},
  });

  const classes = VerifierStyles();

  // $TODO Refactor Formik to useFormik

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.grid}>
        <Formik
          initialValues={{
            fingerprint: "",
          }}
          enableReinitialize
          validationSchema={fingerprintValidation}
          onSubmit={async (values, { resetForm }) => {
            setState((prevState) => ({
              ...prevState,
              loading: true,
            }));
            const { data } = await postVerifier.request({ data: values });
            setState((prevState) => ({
              ...prevState,
              loading: false,
              license: data.license,
            }));
            resetForm();
          }}
        >
          {({ values, errors, touched }) => (
            <Form className={classes.updateEmail}>
              <div>
                <Field name="fingerprint">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      onBlur={() => null}
                      label="Enter license fingerprint"
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
                  Verify
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        {state.loading ? (
          <LoadingSpinner />
        ) : state.license._id ? (
          <div className="table-responsive">
            <table className="simple">
              <thead>
                <tr>
                  <th>Fingerprint</th>
                  <th>Type</th>
                  <th>Buyer ID</th>
                  <th>Seller ID</th>
                  <th>Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr key={state.license._id}>
                  <td>
                    <Typography className="truncate">
                      {state.license.fingerprint}
                    </Typography>
                  </td>
                  <td className="w-64 text-right">
                    <span className="truncate">{state.license.type}</span>
                  </td>
                  <td className="w-64 text-right">
                    <span className="truncate">{state.license.owner}</span>
                  </td>
                  <td className="w-64 text-right">
                    <span className="truncate">
                      {state.license.artwork.owner}
                    </span>
                  </td>
                  <td className="w-64 text-right">
                    <span className="truncate">${state.license.price}</span>
                  </td>
                  <td className="w-64 text-right">
                    <span className="truncate">
                      {formatDate(state.license.created, "dd/MM/yyyy")}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          "Enter a license fingerprint"
        )}
      </Grid>
    </Grid>
  );
};

export default withSnackbar(Verifier);
