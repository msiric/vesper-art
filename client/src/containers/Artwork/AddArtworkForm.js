import { TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import HelpBox from "../../components/HelpBox/HelpBox.js";
import ImageInput from "../../components/ImageInput/ImageInput.js";
import {
  Button,
  Card,
  CardActions,
  CardContent,
} from "../../constants/theme.js";
import PriceInput from "../../shared/PriceInput/PriceInput.js";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import { artworkValidation } from "../../validation/artwork.js";
/* import AddArtworkStyles from "../../components/Artwork/AddArtwork.style.js"; */

const AddArtworkForm = ({
  capabilities,
  user,
  postArtwork,
  postMedia,
  deleteEmptyValues,
}) => {
  const history = useHistory();
  /* const classes = AddArtworkStyles(); */
  const classes = {};

  return (
    <Card p={2}>
      <Formik
        initialValues={{
          artworkMedia: "",
          artworkTitle: "",
          artworkType: "",
          artworkAvailability: "",
          artworkLicense: "",
          artworkUse: "",
          artworkPersonal: "",
          artworkCommercial: "",
          artworkCategory: "",
          artworkDescription: "",
        }}
        validationSchema={artworkValidation}
        onSubmit={async (values, { resetForm }) => {
          const data = deleteEmptyValues(values);
          const formData = new FormData();
          for (let value of Object.keys(data)) {
            formData.append(value, data[value]);
          }
          try {
            /*               const {
                data: { artworkCover, artworkMedia, artworkDimensions },
              } = await postMedia({ data: formData });
              values.artworkCover = artworkCover;
              values.artworkMedia = artworkMedia;
              values.artworkDimensions = artworkDimensions; */
            await postArtwork({ data: formData });
            history.push({
              pathname: "/",
              state: { message: "Artwork published" },
            });
          } catch (err) {
            console.log(err);
          }
        }}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form className={classes.card}>
            {!user.stripeId ? (
              <HelpBox
                type="alert"
                label='To make your artwork commercially available, click on "Become a seller" and complete the Stripe onboarding process'
              />
            ) : capabilities.cardPayments !== "active" ||
              capabilities.platformPayments !== "active" ? (
              <HelpBox
                type="alert"
                label="To make your artwork commercially available, complete your Stripe account information"
              />
            ) : null}
            <CardContent>
              <Field name="artworkMedia">
                {({
                  field,
                  form: { setFieldValue, setFieldTouched },
                  meta,
                }) => (
                  <ImageInput
                    title="Media"
                    meta={meta}
                    field={field}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    helperText={meta.touched && meta.error}
                    error={meta.touched && Boolean(meta.error)}
                    preview={false}
                    shape="square"
                  />
                )}
              </Field>
              <Field name="artworkTitle">
                {({ field, form: { touched, errors }, meta }) => (
                  <TextField
                    {...field}
                    type="text"
                    label="Title"
                    helperText={meta.touched && meta.error}
                    error={meta.touched && Boolean(meta.error)}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                  />
                )}
              </Field>
              <Field name="artworkAvailability">
                {({ field, form: { touched, errors }, meta }) => (
                  <SelectInput
                    {...field}
                    label="Availability"
                    helperText={meta.touched && meta.error}
                    error={meta.touched && Boolean(meta.error)}
                    options={[
                      { value: "" },
                      { value: "available", text: "Available for download" },
                      { value: "unavailable", text: "Only for preview" },
                    ]}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                  />
                )}
              </Field>
              {values.artworkAvailability === "available" && (
                <Field name="artworkType">
                  {({ field, form: { touched, errors }, meta }) => (
                    <SelectInput
                      {...field}
                      label="Type"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      options={[
                        { value: "" },
                        {
                          value: "commercial",
                          text: "Commercial",
                          disabled:
                            user.stripeId &&
                            capabilities.cardPayments === "active" &&
                            capabilities.platformPayments === "active"
                              ? false
                              : true,
                        },
                        { value: "free", text: "Free" },
                      ]}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                </Field>
              )}
              {values.artworkAvailability === "available" && (
                <Field name="artworkLicense">
                  {({ field, form: { touched, errors }, meta }) => (
                    <SelectInput
                      {...field}
                      label="License"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      options={[
                        { value: "" },
                        { value: "commercial", text: "Commercial" },
                        { value: "personal", text: "Personal" },
                      ]}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                </Field>
              )}
              {values.artworkAvailability === "available" &&
                values.artworkType === "commercial" && (
                  <Field name="artworkPersonal">
                    {({ field, form: { touched, errors }, meta }) => (
                      <PriceInput
                        {...field}
                        label="Price"
                        helperText={meta.touched && meta.error}
                        error={meta.touched && Boolean(meta.error)}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </Field>
                )}
              {values.artworkAvailability === "available" &&
                values.artworkLicense === "commercial" && (
                  <Field name="artworkUse">
                    {({ field, form: { touched, errors }, meta }) => (
                      <SelectInput
                        {...field}
                        label="Commercial use"
                        helperText={meta.touched && meta.error}
                        error={meta.touched && Boolean(meta.error)}
                        options={[
                          { value: "" },
                          {
                            value: "separate",
                            text: "Charge commercial license separately",
                            disabled:
                              user.stripeId &&
                              capabilities.cardPayments === "active" &&
                              capabilities.platformPayments === "active"
                                ? false
                                : true,
                          },
                          values.artworkAvailability === "available" &&
                          values.artworkType === "commercial"
                            ? {
                                value: "included",
                                text: "Include commercial license in the price",
                              }
                            : {
                                value: "included",
                                text: "Offer commercial license free of charge",
                              },
                        ]}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </Field>
                )}
              {values.artworkAvailability === "available" &&
                values.artworkLicense === "commercial" &&
                values.artworkUse === "separate" && (
                  <Field name="artworkCommercial">
                    {({ field, form: { touched, errors }, meta }) => (
                      <PriceInput
                        {...field}
                        label="Commercial license"
                        helperText={meta.touched && meta.error}
                        error={meta.touched && Boolean(meta.error)}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  </Field>
                )}
              <Field name="artworkDescription">
                {({ field, form: { touched, errors }, meta }) => (
                  <TextField
                    {...field}
                    type="text"
                    label="Description"
                    helperText={meta.touched && meta.error}
                    error={meta.touched && Boolean(meta.error)}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                  />
                )}
              </Field>
            </CardContent>
            <CardActions className={classes.actions}>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Publish artwork
              </Button>
            </CardActions>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default AddArtworkForm;
