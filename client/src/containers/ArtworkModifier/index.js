import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CardActions, CardContent } from "@material-ui/core";
import {
  AddCircleRounded as UploadIcon,
  DeleteRounded as DeleteIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
  artworkValidation,
  updateArtwork as updateValidation,
} from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import HelpBox from "../../components/HelpBox/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useArtworkUpdate } from "../../contexts/local/artworkUpdate";
import ArtworkForm from "../../forms/ArtworkForm/index.js";
import { Card } from "../../styles/theme.js";

const ArtworkModifier = ({ paramId }) => {
  const stripeId = useUserStore((state) => state.stripeId);

  const artwork = useArtworkUpdate((state) => state.artwork.data);
  const artworkLoading = useArtworkUpdate((state) => state.artwork.loading);
  const capabilities = useArtworkUpdate((state) => state.capabilities.data);
  const loading = useArtworkUpdate((state) => state.capabilities.loading);
  const isDeleting = useArtworkUpdate((state) => state.isDeleting);
  const fetchArtwork = useArtworkUpdate((state) => state.fetchArtwork);
  const fetchCapabilities = useArtworkUpdate(
    (state) => state.fetchCapabilities
  );
  const updateArtwork = useArtworkUpdate((state) => state.updateArtwork);
  const toggleModal = useArtworkUpdate((state) => state.toggleModal);

  const setDefaultValues = () => ({
    artworkMedia: "",
    artworkTitle: artwork.current.title,
    artworkType: artwork.current.type,
    artworkAvailability: artwork.current.availability,
    artworkLicense: artwork.current.license,
    artworkUse: artwork.current.use,
    artworkPersonal:
      artwork.current.use === "included"
        ? artwork.current.commercial
        : artwork.current.personal,
    artworkCommercial:
      artwork.current.license === "commercial"
        ? artwork.current.commercial - artwork.current.personal
        : "",
    artworkDescription: artwork.current.description,
    artworkVisibility: artwork.current.visibility,
    // artworkCategory: artwork.current.category,
    // artworkTags: artwork.current.tags || [],
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
    resolver: yupResolver(artworkValidation.concat(updateValidation)),
  });

  const history = useHistory();

  const onSubmit = async (values) => {
    await updateArtwork({ artworkId: artwork.id, values });
    history.push({
      pathname: "/",
      state: { message: "Artwork updated" },
    });
  };

  useEffect(() => {
    Promise.all([
      fetchArtwork({ artworkId: paramId }),
      fetchCapabilities({ stripeId }),
    ]);
  }, []);

  useEffect(() => {
    reset(setDefaultValues());
  }, [artwork.current]);

  return (
    <Card width="100%">
      {!loading ? (
        !stripeId ? (
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
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <ArtworkForm
              capabilities={capabilities}
              preview={artwork.current.cover.source}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              getValues={getValues}
              watch={watch}
              loading={artworkLoading}
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
              onClick={toggleModal}
              disabled={formState.isSubmitting || isDeleting}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default ArtworkModifier;
