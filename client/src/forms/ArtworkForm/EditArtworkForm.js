import { Card, Grid, TextField } from "@material-ui/core";
import {
  AddCircleRounded as UploadIcon,
  DeleteRounded as DeleteIcon,
} from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import HelpBox from "../../components/HelpBox/index.js";
import ImageInput from "../../components/ImageInput/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import TagInput from "../../components/TagInput/index.js";
import { UserContext } from "../../contexts/User.js";
import PriceInput from "../../shared/PriceInput/PriceInput.js";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import {
  Button,
  CardActions,
  CardContent,
  Container,
} from "../../styles/theme.js";
import { deleteEmptyValues } from "../../utils/helpers.js";
import { artworkValidation } from "../../validation/artwork.js";
import { updateArtwork } from "../../validation/media.js";

const EditArtworkForm = ({
  version = {},
  capabilities,
  handleModalOpen,
  patchArtwork,
  isDeleting,
  loading,
}) => {
  const [userStore] = useContext(UserContext);
  const history = useHistory();
  const classes = {};

  const formatValues = (data) => {
    return {
      ...data,
      artworkType:
        data.artworkAvailability === "available" ? data.artworkType : "",
      artworkLicense:
        data.artworkAvailability === "available" ? data.artworkLicense : "",
      artworkPersonal:
        data.artworkAvailability === "available" &&
        data.artworkType === "commercial"
          ? data.artworkPersonal
          : "",
      artworkUse:
        data.artworkAvailability === "available" &&
        data.artworkLicense === "commercial"
          ? data.artworkUse
          : "",
      artworkCommercial:
        data.artworkAvailability === "available" &&
        data.artworkLicense === "commercial" &&
        data.artworkUse === "separate"
          ? data.artworkCommercial
          : "",
    };
  };

  const handleSubmit = async (values) => {
    try {
      const data = deleteEmptyValues(formatValues(values));
      const formData = new FormData();
      for (let value of Object.keys(data)) {
        if (Array.isArray(data[value])) {
          formData.append(value, JSON.stringify(data[value]));
        } else {
          formData.append(value, data[value]);
        }
      }
      await patchArtwork.request({
        artworkId: version.artwork,
        data: formData,
      });
      history.push({
        pathname: "/",
        state: { message: "Artwork updated" },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className={classes.fixed} style={{ height: "100%" }}>
      <Grid
        container
        className={classes.container}
        style={{ height: "100%", width: "100%" }}
      >
        <Card style={{ height: "100%", width: "100%" }} loading={loading}>
          <Formik
            initialValues={{
              artworkMedia: "",
              artworkTitle: version.title || "",
              artworkType: version.type || "",
              artworkAvailability: version.availability || "",
              artworkLicense: version.license || "",
              artworkUse: version.use || "",
              artworkPersonal:
                version.use === "included"
                  ? version.commercial
                  : version.personal || "",
              artworkCommercial:
                version.license === "commercial"
                  ? version.commercial - version.personal || ""
                  : "",
              artworkCategory: version.category || "",
              artworkDescription: version.description || "",
            }}
            validationSchema={artworkValidation.concat(updateArtwork)}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form className={classes.card}>
                {!loading ? (
                  !userStore.stripeId ? (
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
                  ) : null
                ) : null}
                <CardContent>
                  <Field name="artworkMedia">
                    {({
                      field,
                      form: { setFieldValue, setFieldTouched },
                      meta,
                    }) => (
                      <ImageInput
                        meta={meta}
                        field={field}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        helperText={meta.touched && meta.error}
                        error={meta.touched && Boolean(meta.error)}
                        preview={version.cover}
                        shape="square"
                        noEmpty={true}
                        loading={loading}
                      />
                    )}
                  </Field>
                  <SkeletonWrapper
                    variant="text"
                    loading={loading}
                    width="100%"
                  >
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
                  <SkeletonWrapper
                    variant="text"
                    loading={loading}
                    width="100%"
                  >
                    <Field name="artworkAvailability">
                      {({ field, form: { touched, errors }, meta }) => (
                        <SelectInput
                          {...field}
                          label="Availability"
                          helperText={meta.touched && meta.error}
                          error={meta.touched && Boolean(meta.error)}
                          options={[
                            { value: "" },
                            {
                              value: "available",
                              text: "Available for download",
                            },
                            {
                              value: "unavailable",
                              text: "Only for preview",
                            },
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
                                    text:
                                      "Include commercial license in the price",
                                  }
                                : {
                                    value: "included",
                                    text:
                                      "Offer commercial license free of charge",
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
                  <SkeletonWrapper
                    variant="text"
                    loading={loading}
                    width="100%"
                  >
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
                  <SkeletonWrapper
                    variant="text"
                    loading={loading}
                    width="100%"
                  >
                    <Field name="artworkTags">
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
                        <TagInput
                          {...field}
                          label="Tags"
                          helperText={meta.touched && meta.error}
                          error={meta.touched && Boolean(meta.error)}
                          handleChange={(e, item) =>
                            setFieldValue("artworkTags", item || [])
                          }
                          handleBlur={() =>
                            setFieldTouched("artworkTags", true)
                          }
                          limit={5}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          multiline
                        />
                      )}
                    </Field>
                  </SkeletonWrapper>
                </CardContent>
                <CardActions
                  className={classes.actions}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <SkeletonWrapper loading={loading}>
                    <Button
                      type="submit"
                      variant="outlined"
                      color="primary"
                      disabled={isSubmitting || isDeleting}
                      startIcon={<UploadIcon />}
                    >
                      Publish
                    </Button>
                  </SkeletonWrapper>
                  <SkeletonWrapper loading={loading}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="error"
                      onClick={handleModalOpen}
                      disabled={isSubmitting || isDeleting}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </SkeletonWrapper>
                </CardActions>
              </Form>
            )}
          </Formik>
        </Card>
      </Grid>
    </Container>
  );
};

export default EditArtworkForm;
