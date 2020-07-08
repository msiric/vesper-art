import React from "react";
import { useFormik } from "formik";
import {
  Container,
  Card,
  Typography,
  CardContent,
  CardActions,
  TextField,
  Button,
} from "@material-ui/core";
import UploadInput from "../../shared/UploadInput/UploadInput.js";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import PriceInput from "../../shared/PriceInput/PriceInput.js";
import { useHistory } from "react-router-dom";
import { artworkValidation } from "../../validation/artwork.js";
import AddArtworkStyles from "../../components/Artwork/AddArtwork.style.js";

const AddArtworkForm = ({
  capabilities,
  user,
  postArtwork,
  postMedia,
  deleteEmptyValues,
}) => {
  const history = useHistory();
  const classes = AddArtworkStyles();

  const {
    setFieldValue,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
  } = useFormik({
    initialValues: {
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
    },
    validationSchema: artworkValidation,
    async onSubmit(values) {
      const formData = new FormData();
      formData.append("artworkMedia", values.artworkMedia[0]);
      try {
        const {
          data: { artworkCover, artworkMedia, artworkDimensions },
        } = await postMedia({ data: formData });
        values.artworkCover = artworkCover;
        values.artworkMedia = artworkMedia;
        values.artworkDimensions = artworkDimensions;
        const data = deleteEmptyValues(values);
        await postArtwork({ data });
        history.push({
          pathname: "/",
          state: { message: "Artwork published" },
        });
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <Container fixed className={classes.fixed}>
      <div className={classes.container}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Card className={classes.card}>
            <Typography variant="h6" align="center">
              Add artwork
            </Typography>
            {!user.stripeId
              ? 'To make your artwork commercially available, click on "Become a seller" and complete the Stripe onboarding process'
              : capabilities.cardPayments !== "active" ||
                capabilities.platformPayments !== "active"
              ? "To make your artwork commercially available, complete your Stripe account information"
              : null}
            <CardContent>
              <UploadInput name="artworkMedia" setFieldValue={setFieldValue} />
              <TextField
                name="artworkTitle"
                label="Title"
                type="text"
                value={values.artworkTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.artworkTitle ? errors.artworkTitle : ""}
                error={touched.artworkTitle && Boolean(errors.artworkTitle)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
              <SelectInput
                name="artworkAvailability"
                label="Availability"
                value={values.artworkAvailability}
                handleChange={handleChange}
                handleBlur={handleBlur}
                helperText={
                  touched.artworkAvailability ? errors.artworkAvailability : ""
                }
                error={
                  touched.artworkAvailability &&
                  Boolean(errors.artworkAvailability)
                }
                options={[
                  { value: "" },
                  { value: "available", text: "Available for download" },
                  { value: "unavailable", text: "Only for preview" },
                ]}
              />
              {values.artworkAvailability === "available" && (
                <SelectInput
                  name="artworkType"
                  label="Type"
                  value={values.artworkType}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  helperText={touched.artworkType ? errors.artworkType : ""}
                  error={touched.artworkType && Boolean(errors.artworkType)}
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
                />
              )}
              {values.artworkAvailability === "available" && (
                <SelectInput
                  name="artworkLicense"
                  label="License"
                  value={values.artworkLicense}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  helperText={
                    touched.artworkLicense ? errors.artworkLicense : ""
                  }
                  error={
                    touched.artworkLicense && Boolean(errors.artworkLicense)
                  }
                  options={[
                    { value: "" },
                    { value: "commercial", text: "Commercial" },
                    { value: "personal", text: "Personal" },
                  ]}
                />
              )}
              {values.artworkAvailability === "available" &&
                values.artworkType === "commercial" && (
                  <PriceInput
                    name="artworkPersonal"
                    label="Price"
                    value={values.artworkPersonal}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    helperText={
                      touched.artworkPersonal ? errors.artworkPersonal : ""
                    }
                    error={
                      touched.artworkPersonal && Boolean(errors.artworkPersonal)
                    }
                    margin="dense"
                    variant="outlined"
                    fullWidth
                  />
                )}
              {values.artworkAvailability === "available" &&
                values.artworkLicense === "commercial" && (
                  <SelectInput
                    name="artworkUse"
                    label="Commercial use"
                    value={values.artworkUse}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    helperText={touched.artworkUse ? errors.artworkUse : ""}
                    error={touched.artworkUse && Boolean(errors.artworkUse)}
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
                  />
                )}
              {values.artworkAvailability === "available" &&
                values.artworkLicense === "commercial" &&
                values.artworkUse === "separate" && (
                  <PriceInput
                    name="artworkCommercial"
                    label="Commercial license"
                    value={values.artworkCommercial}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    helperText={
                      touched.artworkCommercial ? errors.artworkCommercial : ""
                    }
                    error={
                      touched.artworkCommercial &&
                      Boolean(errors.artworkCommercial)
                    }
                    margin="dense"
                    variant="outlined"
                    fullWidth
                  />
                )}
              <TextField
                name="artworkDescription"
                label="Description"
                type="text"
                value={values.artworkDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  touched.artworkDescription ? errors.artworkDescription : ""
                }
                error={
                  touched.artworkDescription &&
                  Boolean(errors.artworkDescription)
                }
                margin="dense"
                variant="outlined"
                fullWidth
                multiline
              />
            </CardContent>
            <CardActions className={classes.actions}>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Publish artwork
              </Button>
            </CardActions>
          </Card>
        </form>
      </div>
    </Container>
  );
};

export default AddArtworkForm;
