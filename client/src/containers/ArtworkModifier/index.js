import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddCircleRounded as UploadIcon,
  DeleteRounded as DeleteIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { featureFlags } from "../../../../common/constants";
import { isVersionDifferent } from "../../../../common/helpers";
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
import artworkModifierClasses from "./styles";

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
    resolver: yupResolver(artworkValidation),
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
      ) : capabilities.cardPayments === "pending" ||
        capabilities.platformPayments === "pending" ? (
        <HelpBox type="alert" label={pendingVerification} />
      ) : capabilities.cardPayments !== "active" ||
        capabilities.platformPayments !== "active" ? (
        <HelpBox type="alert" label={incompleteInformation} />
      ) : null
    ) : null;
  };

  useEffect(() => {
    Promise.all([
      fetchArtwork({ artworkId: paramId }),
      ...(stripeId && [fetchCapabilities({ stripeId })]),
    ]);
  }, []);

  useEffect(() => {
    reset(setDefaultValues());
  }, [artwork.current]);

  console.log(getValues(), artwork.current, loading);

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
              watch={watch}
              watchables={[
                "artworkAvailability",
                "artworkType",
                "artworkLicense",
                "artworkUse",
              ]}
              editable={false}
              loading={artworkLoading}
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
              loading={loading}
              disabled={
                !isVersionDifferent(getValues(), artwork.current) ||
                formState.isSubmitting
              }
              startIcon={<UploadIcon />}
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
