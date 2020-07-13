/* import React from "react";
import { useFormik } from "formik";
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import { useHistory } from "react-router-dom";
import { licenseValidation } from "../../validation/license.js";
import AddArtworkStyles from "../../components/Artwork/AddArtwork.style.js";

const AddLicenseForm = ({
  capabilities,
  user,
  postArtwork,
  postMedia,
  deleteEmptyValues,
}) => {
  const history = useHistory();
  const classes = AddArtworkStyles();

  const {
    isSubmitting,
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      licenseType: state.license,
    },
    validationSchema: licenseValidation,
    async onSubmit(values) {
      try {
        history.push({
          pathname: `/checkout/${match.params.id}`,
          state: { payload: values },
        });
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <form className={classes.licenseForm} onSubmit={handleSubmit}>
      <div className={classes.licenseContainer}>
        <Card className={classes.card}>
          <Typography variant="h6" align="center">
            {`Add ${state.license} license`}
          </Typography>
          <CardContent>
            <SelectInput
              name="licenseType"
              label="License type"
              value={values.licenseType}
              className={classes.license}
              disabled
              options={[
                {
                  value: state.license,
                  text: state.license,
                },
              ]}
            />
          </CardContent>
          <CardActions className={classes.actions}>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Continue
            </Button>
            <Button type="button" color="error" onClick={handleModalClose}>
              Close
            </Button>
          </CardActions>
        </Card>
      </div>
    </form>
  );
};

export default AddLicenseForm;
 */
