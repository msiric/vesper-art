import {
  CheckRounded as SaveIcon,
  DeleteOutlineRounded as DeleteIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { featureFlags } from "../../../../common/constants";
import { artworkValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import HelpBox from "../../components/HelpBox/index";
import SyncButton from "../../components/SyncButton/index";
import { useUserStore } from "../../contexts/global/user";
import { useArtworkUpdate } from "../../contexts/local/artworkUpdate";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import ArtworkForm from "../../forms/ArtworkForm/index";
import { useArtworkValidator } from "../../hooks/useArtworkValidator";
import { isFormDisabled } from "../../utils/helpers";
import artworkModifierClasses from "./styles";

const ArtworkModifier = ({ paramId }) => {
  const stripeId = useUserStore((state) => state.stripeId);

  const artwork = useArtworkUpdate((state) => state.artwork.data);
  const capabilities = useArtworkUpdate((state) => state.capabilities.data);
  const artworkLoading = useArtworkUpdate((state) => state.artwork.loading);
  const capabilitiesLoading = useArtworkUpdate(
    (state) => state.capabilities.loading
  );
  const isDeleting = useArtworkUpdate((state) => state.isDeleting);
  const fetchArtwork = useArtworkUpdate((state) => state.fetchArtwork);
  const fetchCapabilities = useArtworkUpdate(
    (state) => state.fetchCapabilities
  );
  const updateArtwork = useArtworkUpdate((state) => state.updateArtwork);
  const toggleModal = useArtworkUpdate((state) => state.toggleModal);

  const loading = artworkLoading || capabilitiesLoading;

  const resolver = useArtworkValidator(artworkValidation);

  const setDefaultValues = () => ({
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
        ? artwork.current.commercial
        : "",
    artworkDescription: artwork.current.description,
    artworkVisibility: artwork.visibility,
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
    resolver: resolver,
  });

  const history = useHistory();

  const classes = artworkModifierClasses();

  const onSubmit = async (values) => {
    await updateArtwork({ artworkId: artwork.id, values });
    history.push({
      pathname: "/",
      state: { message: "Artwork updated" },
    });
  };

  const renderHelpBox = () => {
    // FEATURE FLAG - stripe
    const stripeDisabled = "Creating commercial artwork is not yet available";
    const notOnboarded =
      'To make your artwork commercially available, click on "Become a seller" and complete the Stripe onboarding process';
    const pendingVerification =
      "To make your artwork commercially available, please wait for Stripe to verify the information you entered";
    const incompleteInformation =
      "To make your artwork commercially available, finish entering your Stripe account information";

    return !loading ? (
      !featureFlags.stripe ? (
        <HelpBox type="alert" label={stripeDisabled} />
      ) : !stripeId ? (
        <HelpBox type="alert" label={notOnboarded} />
      ) : capabilities.platformPayments === "pending" ? (
        <HelpBox type="alert" label={pendingVerification} />
      ) : capabilities.platformPayments !== "active" ? (
        <HelpBox type="alert" label={incompleteInformation} />
      ) : null
    ) : null;
  };

  const watchedValues = watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  useEffect(() => {
    Promise.all([
      fetchArtwork({ artworkId: paramId }),
      ...(stripeId && [fetchCapabilities({ stripeId })]),
    ]);
  }, []);

  useEffect(() => {
    reset(setDefaultValues());
  }, [artwork]);

  return (
    <Card>
      {renderHelpBox()}
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
              watchables={{
                artworkAvailability: watchedValues.artworkAvailability,
                artworkType: watchedValues.artworkType,
                artworkLicense: watchedValues.artworkLicense,
                artworkUse: watchedValues.artworkUse,
              }}
              editable={false}
              loading={loading}
            />
          </CardContent>
          <CardActions className={classes.actions}>
            <AsyncButton
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              padding
              submitting={formState.isSubmitting}
              disabled={isDisabled}
              loading={loading}
              startIcon={<SaveIcon />}
            >
              Publish
            </AsyncButton>
            <SyncButton
              type="button"
              variant="outlined"
              color="error"
              onClick={toggleModal}
              submitting={formState.isSubmitting || isDeleting}
              loading={loading}
              disabled={formState.isSubmitting || isDeleting}
              startIcon={<DeleteIcon />}
            >
              Delete
            </SyncButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default ArtworkModifier;
