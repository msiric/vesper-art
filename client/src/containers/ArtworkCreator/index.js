import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { featureFlags, pricing } from "../../../../common/constants.js";
import { addArtwork, artworkValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import HelpBox from "../../components/HelpBox/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useArtworkCreate } from "../../contexts/local/artworkCreate";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import ArtworkForm from "../../forms/ArtworkForm/index.js";
import artworkCreatorStyles from "./styles.js";

const ArtworkCreator = () => {
  const stripeId = useUserStore((state) => state.stripeId);

  const capabilities = useArtworkCreate((state) => state.capabilities.data);
  const loading = useArtworkCreate((state) => state.capabilities.loading);
  const fetchCapabilities = useArtworkCreate(
    (state) => state.fetchCapabilities
  );
  const createArtwork = useArtworkCreate((state) => state.createArtwork);

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
    resolver: yupResolver(artworkValidation.concat(addArtwork)),
  });

  const onSubmit = async (values) => {
    await createArtwork({ values });
    history.push({
      pathname: "/",
      state: { message: "Artwork published" },
    });
  };

  const renderHelpBox = () => {
    // FEATURE FLAG - stripe
    const stripeDisabled =
      "Creating or updating commercial artwork is currently disabled";
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
              watch={watch}
              watchables={[
                "artworkAvailability",
                "artworkType",
                "artworkLicense",
                "artworkUse",
              ]}
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
