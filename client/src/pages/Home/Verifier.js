import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { format } from "date-fns";
import { Field, Form, Formik } from "formik";
import { withSnackbar } from "notistack";
import React, { useState } from "react";
import * as Yup from "yup";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import { postVerifier } from "../../services/home.js";
import globalStyles from "../../styles/global.js";

const fingerprintValidation = Yup.object().shape({
  licenseFingerprint: Yup.string()
    .trim()
    .required("Fingerprint cannot be empty"),
});

const Verifier = () => {
  const [state, setState] = useState({
    loading: false,
    license: {},
  });

  const formatDate = (date, type) => {
    return format(new Date(date), type);
  };

  const globalClasses = globalStyles();

  const handleSubmit = async (values, { resetForm }) => {
    try {
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
    } catch (err) {
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              licenseFingerprint: "",
            }}
            enableReinitialize
            validationSchema={fingerprintValidation}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched }) => (
              <Form>
                <div>
                  <Field name="licenseFingerprint">
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
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    fullWidth
                  >
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
    </Container>
  );
};

export default withSnackbar(Verifier);
