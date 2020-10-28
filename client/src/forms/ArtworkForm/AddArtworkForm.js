import { TextField } from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import HelpBox from "../../components/HelpBox/index.js";
import ImageInput from "../../components/ImageInput/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { UserContext } from "../../contexts/User.js";
import PriceInput from "../../shared/PriceInput/PriceInput.js";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import { Button, Card, CardActions, CardContent } from "../../styles/theme.js";
import { artworkValidation } from "../../validation/artwork.js";
import { addArtwork } from "../../validation/media.js";

/* import AddArtworkStyles from "../../components/Artwork/AddArtwork.style.js"; */

const AddArtworkForm = ({
  capabilities,
  postArtwork,
  deleteEmptyValues,
  loading,
}) => {
  const [userStore] = useContext(UserContext);

  const history = useHistory();

  /* const classes = AddArtworkStyles(); */
  const classes = {};

  const handleSubmit = async (values) => {
    const data = deleteEmptyValues(values);
    const formData = new FormData();
    for (let value of Object.keys(data)) {
      formData.append(value, data[value]);
    }
    try {
      await postArtwork.request({ data: formData });
      history.push({
        pathname: "/",
        state: { message: "Artwork published" },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card width="100%">
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
        validationSchema={artworkValidation.concat(addArtwork)}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form className={classes.card}>
            {!userStore.stripeId ? (
              <HelpBox
                type="alert"
                label='To make your artwork commercially available, click on "Become a seller" and complete the Stripe onboarding process'
              />
            ) : capabilities.cardPayments === "pending" ||
              capabilities.platformPayments === "pending" ? (
              <HelpBox
                type="alert"
                label="To make your artwork commercially available, please wait for Stripe to verify the information you entered"
              />
            ) : capabilities.cardPayments !== "active" ||
              capabilities.platformPayments !== "active" ? (
              <HelpBox
                type="alert"
                label="To make your artwork commercially available, finish entering your Stripe account information"
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
                    noEmpty={false}
                    loading={loading}
                  />
                )}
              </Field>
              <SkeletonWrapper variant="text" loading={loading} width="100%">
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
              </SkeletonWrapper>
              <SkeletonWrapper variant="text" loading={loading} width="100%">
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
              </SkeletonWrapper>
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
                            userStore.stripeId &&
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
                              userStore.stripeId &&
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
              <SkeletonWrapper variant="text" loading={loading} width="100%">
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
                      multiline
                    />
                  )}
                </Field>
              </SkeletonWrapper>
            </CardContent>
            <CardActions className={classes.actions}>
              <SkeletonWrapper loading={loading}>
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={<UploadIcon />}
                >
                  Publish
                </Button>
              </SkeletonWrapper>
            </CardActions>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default AddArtworkForm;
