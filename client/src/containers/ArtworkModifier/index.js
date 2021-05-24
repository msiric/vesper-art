import { yupResolver } from "@hookform/resolvers/yup";
import {
  AddCircleRounded as UploadIcon,
  DeleteRounded as DeleteIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { isVersionDifferent } from "../../../../common/helpers";
import {
  artworkValidation,
  updateArtwork as updateValidation,
} from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import HelpBox from "../../components/HelpBox/index.js";
import SyncButton from "../../components/SyncButton/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useArtworkUpdate } from "../../contexts/local/artworkUpdate";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import ArtworkForm from "../../forms/ArtworkForm/index.js";
import { Card } from "../../styles/theme.js";
import artworkModifierClasses from "./styles.js";

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

  const classes = artworkModifierClasses();

  const onSubmit = async (values) => {
    await updateArtwork({ artworkId: artwork.id, values });
    history.push({
      pathname: "/",
      state: { message: "Artwork updated" },
    });
  };

  const renderHelpBox = () => {
    const notOnboarded =
      'To make your artwork commercially available, click on "Become a seller" and complete the Stripe onboarding process';
    const pendingVerification =
      "To make your artwork commercially available, please wait for Stripe to verify the information you entered";
    const incompleteInformation =
      "To make your artwork commercially available, finish entering your Stripe account information";

    return !loading ? (
      !stripeId ? (
        <HelpBox
          type="alert"
          label={
            !stripeId
              ? notOnboarded
              : capabilities.cardPayments === "pending" ||
                capabilities.platformPayments === "pending"
              ? pendingVerification
              : incompleteInformation
          }
        />
      ) : null
    ) : null;
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
              watchables={""}
              editable={false}
              loading={artworkLoading}
            />
          </CardContent>
          <CardActions className={classes.artworkModifierActions}>
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
