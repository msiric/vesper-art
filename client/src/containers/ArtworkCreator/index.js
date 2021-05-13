import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent } from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { pricing } from "../../../../common/constants.js";
import { addArtwork, artworkValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import HelpBox from "../../components/HelpBox/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useArtworkCreate } from "../../contexts/local/artworkCreate";
import ArtworkForm from "../../forms/ArtworkForm/index.js";
import { Card } from "../../styles/theme.js";

const ArtworkCreator = () => {
  const stripeId = useUserStore((state) => state.stripeId);

  const capabilities = useArtworkCreate((state) => state.capabilities.data);
  const loading = useArtworkCreate((state) => state.capabilities.loading);
  const fetchCapabilities = useArtworkCreate(
    (state) => state.fetchCapabilities
  );
  const createArtwork = useArtworkCreate((state) => state.createArtwork);

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
      artworkCommercial: pricing.minimumPrice,
      artworkCategory: "",
      artworkDescription: "",
      artworkTags: [],
    },
    resolver: yupResolver(artworkValidation.concat(addArtwork)),
  });

  const history = useHistory();

  const onSubmit = async (values) => {
    await createArtwork({ values });
    history.push({
      pathname: "/",
      state: { message: "Artwork published" },
    });
  };

  useEffect(() => {
    if (stripeId) fetchCapabilities({ stripeId });
  }, []);

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
              preview={false}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              getValues={getValues}
              watch={watch}
              loading={loading}
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
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default ArtworkCreator;
