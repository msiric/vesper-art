import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CardActions,
  CardContent,
  Container,
  Grid,
} from "@material-ui/core";
import {
  AddCircleRounded as UploadIcon,
  DeleteRounded as DeleteIcon,
} from "@material-ui/icons";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton/index.js";
import HelpBox from "../../components/HelpBox/index.js";
import MainHeading from "../../components/MainHeading/index.js";
import PromptModal from "../../components/PromptModal/index.js";
import { useTracked as useUserContext } from "../../contexts/User.js";
import ArtworkForm from "../../forms/ArtworkForm/index.js";
import {
  deleteArtwork,
  editArtwork,
  patchArtwork,
} from "../../services/artwork.js";
import { getUser } from "../../services/stripe.js";
import globalStyles from "../../styles/global.js";
import { Card } from "../../styles/theme.js";
import { deleteEmptyValues, formatValues } from "../../utils/helpers.js";
import { artworkValidation } from "../../validation/artwork.js";
import { updateArtwork } from "../../validation/media.js";

const initialState = {
  loading: true,
  isDeleting: false,
  artwork: {
    id: null,
    current: {
      title: "",
      type: "",
      availability: "",
      license: "",
      use: "",
      personal: "",
      commercial: "",
      description: "",
      tags: [],
    },
  },
  fileInput: null,
  capabilities: {},
  modal: {
    open: false,
  },
};

const EditArtwork = ({ match, location }) => {
  const [userStore] = useUserContext();
  const [state, setState] = useState({
    ...initialState,
  });

  const setDefaultValues = () => ({
    artworkMedia: "",
    artworkTitle: state.artwork.current.title,
    artworkType: state.artwork.current.type,
    artworkAvailability: state.artwork.current.availability,
    artworkLicense: state.artwork.current.license,
    artworkUse: state.artwork.current.use,
    artworkPersonal:
      state.artwork.current.use === "included"
        ? state.artwork.current.commercial
        : state.artwork.current.personal,
    artworkCommercial:
      state.artwork.current.license === "commercial"
        ? state.artwork.current.commercial - state.artwork.current.personal
        : "",
    artworkCategory: state.artwork.current.category,
    artworkDescription: state.artwork.current.description,
    artworkTags: state.artwork.current.tags || [],
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    trigger,
    getValues,
    watch,
    reset,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(artworkValidation.concat(updateArtwork)),
  });

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const globalClasses = globalStyles();

  const fetchData = async () => {
    try {
      setState({ ...initialState });
      const {
        data: { artwork },
      } = await editArtwork.request({ artworkId: match.params.id });
      const {
        data: { capabilities },
      } = userStore.stripeId
        ? await getUser.request({ stripeId: userStore.stripeId })
        : { data: { capabilities: {} } };
      setState((prevState) => ({
        ...prevState,
        loading: false,
        artwork: artwork,
        capabilities: capabilities,
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const onSubmit = async (values) => {
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
        artworkId: state.artwork.current.artwork,
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

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: { ...prevState.modal, open: true },
    }));
  };

  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: { ...prevState.modal, open: false },
    }));
  };

  const handleDeleteArtwork = async () => {
    try {
      setState({ ...state, isDeleting: true });
      await deleteArtwork.request({
        artworkId: state.artwork.id,
        data: state.artwork.current.id,
      });
      history.push("/");
      enqueueSnackbar(deleteArtwork.success.message, {
        variant: deleteArtwork.success.variant,
      });
    } catch (err) {
      enqueueSnackbar(deleteArtwork.error.message, {
        variant: deleteArtwork.error.variant,
      });
    } finally {
      setState({ ...state, isDeleting: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  useEffect(() => {
    reset(setDefaultValues());
  }, [state.artwork.current]);

  return (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        {state.loading || state.artwork.id ? (
          <Grid item sm={12} style={{ height: "100%" }}>
            <MainHeading
              text="Edit artwork"
              className={globalClasses.mainHeading}
            />
            <Card width="100%">
              {!userStore.stripeId ? (
                <HelpBox
                  type="alert"
                  label='To make your artwork commercially available, click on "Become a seller" and complete the Stripe onboarding process'
                />
              ) : state.capabilities.cardPayments === "pending" ||
                state.capabilities.platformPayments === "pending" ? (
                <HelpBox
                  type="alert"
                  label="To make your artwork commercially available, please wait for Stripe to verify the information you entered"
                />
              ) : state.capabilities.cardPayments !== "active" ||
                state.capabilities.platformPayments !== "active" ? (
                <HelpBox
                  type="alert"
                  label="To make your artwork commercially available, finish entering your Stripe account information"
                />
              ) : null}
              <FormProvider control={control}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent>
                    <ArtworkForm
                      capabilities={state.capabilities}
                      preview={state.artwork.current.cover}
                      errors={errors}
                      setValue={setValue}
                      trigger={trigger}
                      getValues={getValues}
                      watch={watch}
                      loading={state.loading}
                    />
                  </CardContent>
                  <CardActions
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <AsyncButton
                      type="submit"
                      fullWidth
                      variant="outlined"
                      color="primary"
                      padding
                      loading={formState.isSubmitting}
                      startIcon={<UploadIcon />}
                    >
                      Publish
                    </AsyncButton>
                    <Button
                      type="button"
                      variant="outlined"
                      color="error"
                      onClick={handleModalOpen}
                      disabled={formState.isSubmitting || state.isDeleting}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </form>
              </FormProvider>
            </Card>
          </Grid>
        ) : (
          // $TODO push to home and display error notification
          "Ne postoji"
        )}
      </Grid>
      <PromptModal
        open={state.modal.open}
        handleConfirm={handleDeleteArtwork}
        handleClose={handleModalClose}
        ariaLabel="Delete artwork"
        promptTitle="Are you sure you want to delete this artwork?"
        promptConfirm="Delete"
        promptCancel="Cancel"
        isSubmitting={state.isDeleting}
      />
    </Container>
  );
};

export default EditArtwork;
