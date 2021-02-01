import { yupResolver } from "@hookform/resolvers/yup";
import {
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  AddCircleRounded as UploadIcon,
  LabelImportantRounded as LabelIcon,
  MonetizationOnRounded as MonetizationIcon,
} from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { countries } from "../../../../common/constants.js";
import { originValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import HelpBox from "../../components/HelpBox/index.js";
import { useTracked as useUserContext } from "../../contexts/global/user.js";
import OnboardingForm from "../../forms/OnboardingForm/index.js";
import { postAuthorize } from "../../services/stripe.js";
import { patchOrigin } from "../../services/user.js";
import globalStyles from "../../styles/global.js";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "../../styles/theme.js";

const Onboarding = () => {
  const [userStore] = useUserContext();

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      userBusinessAddress: "",
    },
    resolver: yupResolver(originValidation),
  });

  const onSubmit = async (values) => {
    try {
      if (!userStore.stripeId) {
        await patchOrigin.request({
          userId: userStore.id,
          data: {
            ...values,
            userBusinessAddress: values.userBusinessAddress,
          },
        });
        const { data } = await postAuthorize.request({
          userBusinessAddress: values.userBusinessAddress,
          userEmail: userStore.email,
        });
        window.location.href = data.url;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Card>
            <CardContent
              style={{ display: "flex" }}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              p={2}
            >
              <HelpBox
                type="alert"
                label="Stripe currently only supports countries found in the dropdown below"
                margin={4}
              />
              <MonetizationIcon style={{ fontSize: 150 }} />
              {userStore.stripeId ? (
                <Typography variant="subtitle1" mb={4}>
                  You already went through the onboarding process
                </Typography>
              ) : (
                <>
                  <Typography variant="h4" mb={4}>
                    Start getting paid
                  </Typography>
                  <Typography color="textSecondary" mb={4}>
                    We use Stripe to make sure you get paid on time and to keep
                    your personal bank and details secure. Click on continue to
                    set up your payments on Stripe.
                  </Typography>
                  <List
                    component="nav"
                    aria-label="Becoming a seller"
                    style={{ marginBottom: 30 }}
                    disablePadding
                  >
                    <ListItem>
                      <ListItemIcon>
                        <LabelIcon />
                      </ListItemIcon>
                      <ListItemText primary="Complete the onboarding process" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LabelIcon />
                      </ListItemIcon>
                      <ListItemText primary="Upload your artwork" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LabelIcon />
                      </ListItemIcon>
                      <ListItemText primary="Set how much you want to charge for personal and commercial licenses" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LabelIcon />
                      </ListItemIcon>
                      <ListItemText primary="Transfer your earnings from your dashboard to your Stripe account" />
                    </ListItem>
                  </List>
                  {/* $TODO Refactor supportedCountries */}
                  {userStore.businessAddress ? (
                    countries[userStore.businessAddress] &&
                    countries[userStore.businessAddress].supported ? (
                      <Typography
                        color="textSecondary"
                        style={{ alignSelf: "flex-start" }}
                      >
                        Please confirm your registered business address
                      </Typography>
                    ) : (
                      <Typography
                        color="textSecondary"
                        style={{ alignSelf: "flex-start" }}
                      >
                        Your currently saved registered business address is not
                        supported for Stripe payments
                      </Typography>
                    )
                  ) : (
                    <Typography
                      color="textSecondary"
                      style={{ alignSelf: "flex-start" }}
                    >
                      Please select your registered business address
                    </Typography>
                  )}
                </>
              )}
              <FormProvider control={control}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent>
                    <OnboardingForm
                      errors={errors}
                      getValues={getValues}
                      setValue={setValue}
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
                      Continue
                    </AsyncButton>
                  </CardActions>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Onboarding;
