import { ArrowUpwardRounded as SubmitIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { pricing } from "../../../../common/constants";
import {
  artworkValidation,
  mediaValidation,
} from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import { useUserStore } from "../../contexts/global/user";
import { useArtworkCreate } from "../../contexts/local/artworkCreate";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import ArtworkForm from "../../forms/ArtworkForm/index";
import { useArtworkValidator } from "../../hooks/useArtworkValidator";
import { displayOnboardingWarning, isFormDisabled } from "../../utils/helpers";
import artworkCreatorStyles from "./styles";

const ArtworkCreator = () => {
  const stripeId = useUserStore((state) => state.stripeId);
  const onboarded = useUserStore((state) => state.onboarded);

  const requirements = useArtworkCreate((state) => state.requirements.data);
  const loading = useArtworkCreate((state) => state.requirements.loading);
  const fetchRequirements = useArtworkCreate(
    (state) => state.fetchRequirements
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
      pathname: "/my_artwork",
      state: { message: "Artwork published" },
    });
  };

  useEffect(() => {
    if (stripeId) fetchRequirements({ stripeId });
  }, []);

  return (
    <Card>
      {displayOnboardingWarning(loading, stripeId, onboarded, requirements)}
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <ArtworkForm
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
