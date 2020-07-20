import React from "react";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import { useFormik } from "formik";
import UploadInput from "../../shared/UploadInput/UploadInput.js";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  Link as Anchor,
} from "@material-ui/core";
import { postMedia, patchUser } from "../../services/user.js";
import { profileValidation } from "../../validation/profile.js";
import { countries } from "../../../../common/constants.js";
import EditUserFormStyles from "./EditUserForm.style";

const EditUserForm = ({ match, user, handleModalClose }) => {
  const {
    isSubmitting,
    setFieldValue,
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
      userMedia: user.photo,
      userDescription: user.description,
      userCountry: user.country,
    },
    validationSchema: profileValidation,
    async onSubmit(values) {
      try {
        if (values.userMedia.length) {
          const formData = new FormData();
          formData.append("userMedia", values.userMedia[0]);
          const {
            data: { userMedia, userDimensions },
          } = await postMedia({ data: formData });
          values.userMedia = userMedia;
          values.userDimensions = userDimensions;
        }
        await patchUser({ userId: user._id, data: values });
      } catch (err) {
        console.log(err);
      }
    },
  });

  const classes = EditUserFormStyles();

  return (
    <form className={classes.editUserForm} onSubmit={handleSubmit}>
      <Card className={classes.editUserContainer}>
        <Typography variant="h6" align="center">
          Edit info
        </Typography>
        <CardContent>
          <UploadInput name="userMedia" setFieldValue={setFieldValue} />
          <TextField
            name="userDescription"
            label="Description"
            type="text"
            value={values.userDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.userDescription ? errors.userDescription : ""}
            error={touched.userDescription && Boolean(errors.userDescription)}
            margin="dense"
            variant="outlined"
            fullWidth
          />
          <SelectInput
            name="userCountry"
            label="Country"
            value={values.userCountry}
            handleChange={handleChange}
            handleBlur={handleBlur}
            helperText={touched.userCountry ? errors.userCountry : ""}
            error={touched.userCountry && Boolean(errors.userCountry)}
            options={countries}
          />
        </CardContent>
        <CardActions className={classes.actions}>
          <Button type="submit" color="primary" disabled={isSubmitting}>
            Update
          </Button>
          <Button type="button" color="error" onClick={handleModalClose}>
            Close
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default EditUserForm;
