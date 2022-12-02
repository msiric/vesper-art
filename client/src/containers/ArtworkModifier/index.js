import {
  CheckRounded as SaveIcon,
  DeleteOutlineRounded as DeleteIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { artworkValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import SyncButton from "../../components/SyncButton/index";
import { useUserStore } from "../../contexts/global/user";
import { useArtworkUpdate } from "../../contexts/local/artworkUpdate";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import ArtworkForm from "../../forms/ArtworkForm/index";
import { useArtworkValidator } from "../../hooks/useArtworkValidator";
import { displayOnboardingWarning, isFormDisabled } from "../../utils/helpers";
import artworkModifierClasses from "./styles";

const ArtworkModifier = ({ paramId }) => {
  const userId = useUserStore((state) => state.id);
  const stripeId = useUserStore((state) => state.stripeId);
  const onboarded = useUserStore((state) => state.onboarded);

  const artwork = useArtworkUpdate((state) => state.artwork.data);
  const artworkLoading = useArtworkUpdate((state) => state.artwork.loading);
  const requirements = useArtworkUpdate((state) => state.requirements.data);
  const requirementsLoading = useArtworkUpdate(
    (state) => state.requirements.loading
  );
  const isDeleting = useArtworkUpdate((state) => state.isDeleting);
  const fetchArtwork = useArtworkUpdate((state) => state.fetchArtwork);
  const fetchRequirements = useArtworkUpdate(
    (state) => state.fetchRequirements
  );
  const updateArtwork = useArtworkUpdate((state) => state.updateArtwork);
  const toggleModal = useArtworkUpdate((state) => state.toggleModal);

  const loading = artworkLoading || requirementsLoading;

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
    resolver,
  });

  const history = useHistory();

  const classes = artworkModifierClasses();

  const onSubmit = async (values) => {
    try {
      await updateArtwork({ userId, artworkId: artwork.id, values });
      history.push({
        pathname: "/",
        state: { message: "Artwork updated" },
      });
    } catch (err) {
      // do nothing
    }
  };

  const watchedValues = watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  useEffect(() => {
    Promise.all([
      fetchArtwork({ userId, artworkId: paramId }),
      ...(stripeId && [fetchRequirements({ stripeId })]),
    ]);
  }, []);

  useEffect(() => {
    reset(setDefaultValues());
  }, [artwork]);

  return (
    <Card>
      {displayOnboardingWarning(loading, stripeId, onboarded, requirements)}
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <ArtworkForm
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
              color="secondary"
              fullWidth
              variant="outlined"
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
