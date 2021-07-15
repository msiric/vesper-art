import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { featureFlags, pricing } from "../../../../common/constants";
import { addArtwork, artworkValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import HelpBox from "../../components/HelpBox/index";
import { useUserStore } from "../../contexts/global/user";
import { useArtworkCreate } from "../../contexts/local/artworkCreate";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import ArtworkForm from "../../forms/ArtworkForm/index";
import { useArtworkValidator } from "../../hooks/useArtworkValidator";
import artworkCreatorStyles from "./styles";

const ArtworkCreator = () => {
  const stripeId = useUserStore((state) => state.stripeId);

  const capabilities = useArtworkCreate((state) => state.capabilities.data);
  const loading = useArtworkCreate((state) => state.capabilities.loading);
  const fetchCapabilities = useArtworkCreate(
    (state) => state.fetchCapabilities
  );
  const createArtwork = useArtworkCreate((state) => state.createArtwork);

  const resolver = useArtworkValidator(artworkValidation.concat(addArtwork));

  const history = useHistory();

  const classes = artworkCreatorStyles();

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
    defaultValues: {
      artworkMedia: "",
      artworkTitle: "",
      artworkType: "",
      artworkAvailability: "",
      artworkLicense: "",
      artworkUse: "",
      artworkPersonal: pricing.minimumPrice,
      artworkCommercial: pricing.minimumPrice + 10,
      artworkVisibility: "",
      artworkDescription: "",
      // artworkCategory: "",
      // artworkTags: [],
    },
    resolver,
  });

  const watchedValues = watch();

  const onSubmit = async (values) => {
    await createArtwork({ values });
    history.push({
      pathname: "/",
      state: { message: "Artwork published" },
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
    if (stripeId) fetchCapabilities({ stripeId });
  }, []);

  return (
    <Card>
      {renderHelpBox()}
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <ArtworkForm
              capabilities={capabilities}
              preview={false}
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
              editable={true}
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
              loading={loading}
              startIcon={<UploadIcon />}
            >
              Publish
            </AsyncButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default ArtworkCreator;
