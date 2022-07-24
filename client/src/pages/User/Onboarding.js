import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core";
import {
  LabelImportantRounded as LabelIcon,
  MonetizationOnRounded as MonetizationIcon,
  NextWeekOutlined as OnboardIcon,
} from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { appName, countries } from "../../../../common/constants";
import { originValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import HelpBox from "../../components/HelpBox/index";
import ListItems from "../../components/ListItems/index";
import { useUserStore } from "../../contexts/global/user";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import OnboardingForm from "../../forms/OnboardingForm/index";
import { postAuthorize } from "../../services/stripe";
import { patchOrigin } from "../../services/user";
import globalStyles from "../../styles/global";
import { isFormDisabled } from "../../utils/helpers";

const useOnboardingStyles = makeStyles((muiTheme) => ({
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    maxWidth: 750,
    margin: "0 auto",
  },
  icon: {
    fontSize: 150,
  },
  heading: {
    marginBottom: 24,
    textAlign: "center",
  },
  text: {
    marginBottom: 4,
  },
  label: {
    textAlign: "center",
    marginBottom: 16,
  },
  list: {
    margin: "36px 0",
    width: "100%",
  },
  form: {
    maxWidth: 250,
    width: "100%",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const onboardingItems = [
  { icon: <LabelIcon />, label: "Start the onboarding process with Stripe" },
  {
    icon: <LabelIcon />,
    label:
      "Fill in the necessary information and upload the required documentation",
  },
  {
    icon: <LabelIcon />,
    label: `Wait for Stripe to verify the provided details and get redirected back to ${appName}`,
  },
  {
    icon: <LabelIcon />,
    label:
      "Take full control of your artwork and start earning money for each placed order",
  },
];

const Onboarding = () => {
  const userId = useUserStore((state) => state.id);
  const userEmail = useUserStore((state) => state.email);
  const userAddress = useUserStore((state) => state.businessAddress);
  const stripeId = useUserStore((state) => state.stripeId);

  const history = useHistory();

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

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  if (userId && stripeId) {
    history.push("/onboarded");
  }

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <HelpBox
              type="alert"
              label="Stripe currently only supports countries found in the dropdown below"
            />
            <CardContent className={classes.content}>
              <MonetizationIcon className={classes.icon} />
              <Box className={classes.wrapper}>
                <Typography className={classes.heading} variant="h4">
                  Complete the onboarding process and start getting paid
                </Typography>
                <Typography className={classes.text} color="textSecondary">
                  Stripe is used to make sure you get paid on time and to keep
                  your bank information and details secure. This will link your
                  accounts and allow for a seamless experience between the two
                  platforms while ensuring the highest levels of security,
                  privacy and compliance.
                </Typography>
                <ListItems className={classes.list} items={onboardingItems} />
                {/* $TODO Refactor supportedCountries */}
                {userAddress ? (
                  countries[userAddress] && countries[userAddress].supported ? (
                    <Typography color="textSecondary" className={classes.label}>
                      Please confirm your registered business address
                    </Typography>
                  ) : (
                    <Typography color="textSecondary" className={classes.label}>
                      Your currently saved registered business address is not
                      supported for Stripe payments
                    </Typography>
                  )
                ) : (
                  <Typography color="textSecondary" className={classes.label}>
                    Please select your registered business address
                  </Typography>
                )}
                <FormProvider control={control}>
                  <form
                    className={classes.form}
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <OnboardingForm
                      errors={errors}
                      getValues={getValues}
                      setValue={setValue}
                    />
                    <AsyncButton
                      type="submit"
                      color="secondary"
                      fullWidth
                      padding
                      submitting={formState.isSubmitting}
                      disabled={isDisabled}
                      startIcon={<OnboardIcon />}
                    >
                      Continue
                    </AsyncButton>
                  </form>
                </FormProvider>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Onboarding;
