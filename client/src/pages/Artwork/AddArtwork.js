import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent, Container, Grid } from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { useHistory } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton/index.js";
import HelpBox from "../../components/HelpBox/index.js";
import MainHeading from "../../components/MainHeading/index.js";
import { useTracked as useUserContext } from "../../contexts/User.js";
import ArtworkForm from "../../forms/ArtworkForm/index.js";
import { postArtwork } from "../../services/artwork.js";
import { getUser } from "../../services/stripe.js";
import globalStyles from "../../styles/global.js";
import { Card } from "../../styles/theme.js";
import { deleteEmptyValues, formatValues } from "../../utils/helpers.js";
import { artworkValidation } from "../../validation/artwork.js";
import { addArtwork } from "../../validation/media.js";

const AddArtwork = () => {
  const [userStore] = useUserContext();

  const cache = useQueryCache();

  const { data: fetchUserResponse, status: fetchUserStatus } = useQuery(
    ["fetchUser", { stripeId: userStore.stripeId }],
    getUser.request,
    { enabled: userStore.stripeId }
  );

  const [initPostArtwork, { status: postArtworkStatus }] = useMutation(
    postArtwork.request
  );

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    trigger,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      artworkMedia: "",
      artworkTitle: "",
      artworkType: "",
      artworkAvailability: "",
      artworkLicense: "",
      artworkUse: "",
      artworkPersonal: "",
      artworkCommercial: "",
      artworkCategory: "",
      artworkDescription: "",
      artworkTags: [],
    },
    resolver: yupResolver(artworkValidation.concat(addArtwork)),
  });

  const history = useHistory();

  const globalClasses = globalStyles();

  const onSubmit = async (values) => {
    const data = deleteEmptyValues(formatValues(values));
    const formData = new FormData();
    for (let value of Object.keys(data)) {
      if (Array.isArray(data[value])) {
        formData.append(value, JSON.stringify(data[value]));
      } else {
        formData.append(value, data[value]);
      }
    }
    try {
      await initPostArtwork({ data: formData });
      history.push({
        pathname: "/",
        state: { message: "Artwork published" },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const isLoading = () => fetchUserStatus === "loading";

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <MainHeading
            text="Add artwork"
            className={globalClasses.mainHeading}
          />
          <Card width="100%">
            {!isLoading() &&
              (!userStore.stripeId ? (
                <HelpBox
                  type="alert"
                  label='To make your artwork commercially available, click on "Become a seller" and complete the Stripe onboarding process'
                />
              ) : fetchUserResponse.data.capabilities.cardPayments ===
                  "pending" ||
                fetchUserResponse.data.capabilities.platformPayments ===
                  "pending" ? (
                <HelpBox
                  type="alert"
                  label="To make your artwork commercially available, please wait for Stripe to verify the information you entered"
                />
              ) : fetchUserResponse.data.capabilities.cardPayments !==
                  "active" ||
                fetchUserResponse.data.capabilities.platformPayments !==
                  "active" ? (
                <HelpBox
                  type="alert"
                  label="To make your artwork commercially available, finish entering your Stripe account information"
                />
              ) : null)}
            <FormProvider control={control}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                  <ArtworkForm
                    capabilities={
                      fetchUserResponse && fetchUserResponse.data.capabilities
                    }
                    preview={false}
                    errors={errors}
                    setValue={setValue}
                    trigger={trigger}
                    getValues={getValues}
                    watch={watch}
                    loading={isLoading()}
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddArtwork;
