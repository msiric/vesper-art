import React, { useState, useEffect, useContext, useCallback } from "react";
import { Context } from "../Store/Store.js";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import {
  Container,
  Card,
  Grid,
  CircularProgress,
  Typography,
  CardContent,
  CardActions,
  TextField,
  Button,
} from "@material-ui/core";
import UploadInput from "../../shared/UploadInput/UploadInput.js";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import PriceInput from "../../shared/PriceInput/PriceInput.js";
import { ax } from "../../shared/Interceptor/Interceptor.js";
import { deleteEmptyValues } from "../../utils/helpers.js";
import EditArtworkStyles from "./EditArtwork.style.js";
import {
  editArtwork,
  deleteArtwork,
  postMedia,
  patchArtwork,
} from "../../services/artwork.js";
import { getUser } from "../../services/stripe.js";

const EditArtwork = ({ match }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    isDeleting: false,
    artwork: {},
    capabilities: {},
  });
  const history = useHistory();

  const classes = EditArtworkStyles();

  const fetchData = async () => {
    try {
      const {
        data: { artwork },
      } = await editArtwork({ artworkId: match.params.id });
      const {
        data: { capabilities },
      } = store.user.stripeId
        ? await getUser({ stripeId: store.user.stripeId })
        : { data: { capabilities: {} } };
      setState({
        ...state,
        loading: false,
        artwork: artwork,
        capabilities: capabilities,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handleDeleteArtwork = async () => {
    try {
      setState({ ...state, isDeleting: true });
      await deleteArtwork({ artworkId: match.params.id });
      history.push({
        pathname: "/",
        state: { message: "Artwork deleted" },
      });
    } catch (err) {
      setState({ ...state, isDeleting: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    enableReinitialize: true,
    initialValues: {
      artworkMedia: state.artwork.media || "",
      artworkTitle: state.artwork.title || "",
      artworkType: state.artwork.type || "",
      artworkAvailability: state.artwork.availability || "",
      artworkLicense: state.artwork.license || "",
      artworkUse: state.artwork.use || "",
      artworkPersonal: state.artwork.personal || "",
      artworkCommercial: state.artwork.commercial || "",
      artworkCategory: state.artwork.category || "",
      artworkDescription: state.artwork.description || "",
    },
    validationSchema,
    async onSubmit(values) {
      const formData = new FormData();
      formData.append("artworkMedia", values.artworkMedia[0]);
      try {
        const {
          data: { artworkCover, artworkMedia },
        } = await postMedia({ data: formData });
        values.artworkCover = artworkCover;
        values.artworkMedia = artworkMedia;
        const data = deleteEmptyValues(values);
        await patchArtwork({ artworkId: match.params.id, data });
        history.push({
          pathname: "/",
          state: { message: "Artwork edited" },
        });
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.artwork._id ? (
          <Grid item sm={12} className={classes.container}>
            <form className={classes.form} onSubmit={handleSubmit}>
              <Card className={classes.card}>
                <Typography variant="h6" align="center">
                  Edit artwork
                </Typography>
                {!store.user.stripeId
                  ? 'To make your artwork commercially available, click on "Become a seller" and complete the Stripe onboarding process'
                  : state.capabilities.cardPayments !== "active" ||
                    state.capabilities.platformPayments !== "active"
                  ? "To make your artwork commercially available, complete your Stripe account information"
                  : null}
                <CardContent>
                  <UploadInput
                    name="artworkMedia"
                    setFieldValue={setFieldValue}
                  />
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
                      touched.artworkAvailability
                        ? errors.artworkAvailability
                        : ""
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
                            store.user.stripeId &&
                            state.capabilities.cardPayments === "active" &&
                            state.capabilities.platformPayments === "active"
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
                          touched.artworkPersonal &&
                          Boolean(errors.artworkPersonal)
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
                              store.user.stripeId &&
                              state.capabilities.cardPayments === "active" &&
                              state.capabilities.platformPayments === "active"
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
                          touched.artworkCommercial
                            ? errors.artworkCommercial
                            : ""
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
                      touched.artworkDescription
                        ? errors.artworkDescription
                        : ""
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
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isSubmitting || state.isDeleting}
                  >
                    Publish artwork
                  </Button>
                  <Button
                    type="button"
                    color="error"
                    onClick={handleDeleteArtwork}
                    disabled={isSubmitting || state.isDeleting}
                  >
                    Delete artwork
                  </Button>
                </CardActions>
              </Card>
            </form>
          </Grid>
        ) : (
          history.push("/")
        )}
      </Grid>
    </Container>
  );
};

export default EditArtwork;
