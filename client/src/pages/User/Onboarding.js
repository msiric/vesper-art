import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core";
import {
  AddCircleRounded as UploadIcon,
  LabelImportantRounded as LabelIcon,
  MonetizationOnRounded as MonetizationIcon,
} from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { countries } from "../../../../common/constants";
import { isFormAltered } from "../../../../common/helpers";
import { originValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import HelpBox from "../../components/HelpBox/index";
import ListItems from "../../components/ListItems/index";
import { useUserStore } from "../../contexts/global/user";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import OnboardingForm from "../../forms/OnboardingForm/index";
import { postAuthorize } from "../../services/stripe";
import { patchOrigin } from "../../services/user";
import globalStyles from "../../styles/global";

const useOnboardingStyles = makeStyles((muiTheme) => ({
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  helpBox: {
    margin: 4,
  },
  icon: {
    fontSize: 150,
  },
  text: {
    marginBottom: 4,
  },
  label: {
    alignSelf: "flex-start",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const Onboarding = () => {
  const userId = useUserStore((state) => state.id);
  const userEmail = useUserStore((state) => state.email);
  const userAddress = useUserStore((state) => state.businessAddress);
  const stripeId = useUserStore((state) => state.stripeId);

  const globalClasses = globalStyles();
  const classes = useOnboardingStyles();

  const setDefaultValues = () => ({
    userBusinessAddress: "",
  });

  const {
    handleSubmit,
    getValues,
    formState,
    errors,
    control,
    setValue,
    watch,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(originValidation),
  });

  const onboardingItems = [
    { icon: <LabelIcon />, label: "Complete the onboarding process" },
    { icon: <LabelIcon />, label: "Upload your artwork" },
    {
      icon: <LabelIcon />,
      label:
        "Set how much you want to charge for personal and commercial licenses",
    },
    {
      icon: <LabelIcon />,
      label:
        "Transfer your earnings from your dashboard to your Stripe account",
    },
  ];

  const onSubmit = async (values) => {
    try {
      if (!stripeId) {
        await patchOrigin.request({
          userId,
          data: {
            ...values,
            userBusinessAddress: values.userBusinessAddress,
          },
        });
        const { data } = await postAuthorize.request({
          userBusinessAddress: values.userBusinessAddress,
          userEmail,
        });
        window.location.href = data.url;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const watchedValues = watch();

  const isDisabled =
    !isFormAltered(getValues(), setDefaultValues()) || formState.isSubmitting;

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Card>
            <CardContent className={classes.content}>
              <HelpBox
                type="alert"
                label="Stripe currently only supports countries found in the dropdown below"
                className={classes.helpBox}
              />
              <MonetizationIcon className={classes.icon} />
              {stripeId ? (
                <Typography className={classes.text} variant="subtitle1">
                  You already went through the onboarding process
                </Typography>
              ) : (
                <>
                  <Typography className={classes.text} variant="h4">
                    Start getting paid
                  </Typography>
                  <Typography className={classes.text} color="textSecondary">
                    We use Stripe to make sure you get paid on time and to keep
                    your personal bank and details secure. Click on continue to
                    set up your payments on Stripe.
                  </Typography>
                  <ListItems items={onboardingItems} />
                  {/* $TODO Refactor supportedCountries */}
                  {userAddress ? (
                    countries[userAddress] &&
                    countries[userAddress].supported ? (
                      <Typography
                        color="textSecondary"
                        className={classes.label}
                      >
                        Please confirm your registered business address
                      </Typography>
                    ) : (
                      <Typography
                        color="textSecondary"
                        className={classes.label}
                      >
                        Your currently saved registered business address is not
                        supported for Stripe payments
                      </Typography>
                    )
                  ) : (
                    <Typography color="textSecondary" className={classes.label}>
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
                  <CardActions className={classes.actions}>
                    <AsyncButton
                      type="submit"
                      fullWidth
                      padding
                      submitting={formState.isSubmitting}
                      disabled={isDisabled}
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
