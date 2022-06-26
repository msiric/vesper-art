import { ArrowUpwardRounded as SubmitIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { featureFlags, pricing } from "../../../../common/constants";
import {
  artworkValidation,
  mediaValidation,
} from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import HelpBox from "../../components/HelpBox/index";
import { useUserStore } from "../../contexts/global/user";
import { useArtworkCreate } from "../../contexts/local/artworkCreate";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import ArtworkForm from "../../forms/ArtworkForm/index";
import { useArtworkValidator } from "../../hooks/useArtworkValidator";
import { isFormDisabled } from "../../utils/helpers";
import artworkCreatorStyles from "./styles";

const ArtworkCreator = () => {
  const stripeId = useUserStore((state) => state.stripeId);

  const capabilities = useArtworkCreate((state) => state.capabilities.data);
  const loading = useArtworkCreate((state) => state.capabilities.loading);
  const fetchCapabilities = useArtworkCreate(
    (state) => state.fetchCapabilities
  );
  const createArtwork = useArtworkCreate((state) => state.createArtwork);

  const resolver = useArtworkValidator(
    artworkValidation.concat(mediaValidation)
  );

  const history = useHistory();

  const classes = artworkCreatorStyles();

  const setDefaultValues = () => ({
    artworkMedia: null,
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
    resolver,
  });

  const watchedValues = watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

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
      ) : capabilities.platformPayments === "pending" ? (
        <HelpBox type="alert" label={pendingVerification} />
      ) : capabilities.platformPayments !== "active" ? (
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
              editable
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
              startIcon={<SubmitIcon />}
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
