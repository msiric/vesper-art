import { yupResolver } from "@hookform/resolvers/yup";
import {
  LabelImportantRounded as LabelIcon,
  MonetizationOnRounded as MonetizationIcon,
  NextWeekOutlined as OnboardIcon,
} from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { appName } from "../../../../common/constants";
import { originValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import HelpBox from "../../components/HelpBox/index";
import ListItems from "../../components/ListItems/index";
import { useUserStore } from "../../contexts/global/user";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Typography from "../../domain/Typography";
import OnboardingForm from "../../forms/OnboardingForm/index";
import { postAuthorize } from "../../services/stripe";
import { isFormDisabled } from "../../utils/helpers";
import onboardingCardStyles from "./styles";

const renderOnboardingItems = (stripeId) => [
  {
    icon: <LabelIcon />,
    label: stripeId
      ? "Continue the onboarding process with Stripe"
      : "Start the onboarding process with Stripe",
  },
  {
    icon: <LabelIcon />,
    label: stripeId
      ? "Fill in the missing information and upload the required documentation"
      : "Fill in the necessary information and upload the required documentation",
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

const OnboardingCard = () => {
  const userId = useUserStore((state) => state.id);
  const userEmail = useUserStore((state) => state.email);
  const stripeId = useUserStore((state) => state.stripeId);
  const onboarded = useUserStore((state) => state.onboarded);

  const history = useHistory();

  const classes = onboardingCardStyles();

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
    resolver: !stripeId ? yupResolver(originValidation) : null,
  });

  const onSubmit = async (values) => {
    try {
      await postAuthorize.request({
        userBusinessAddress: values.userBusinessAddress,
        userEmail,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const watchedValues = watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  if (userId && stripeId && onboarded) {
    history.push("/onboarded");
  }

  return (
    <Card>
      {!stripeId && (
        <HelpBox
          type="alert"
          label={`${appName} currently only supports countries found in the dropdown below`}
        />
      )}
      <CardContent className={classes.content}>
        <MonetizationIcon className={classes.icon} />
        <Box className={classes.wrapper}>
          <Typography className={classes.heading} variant="h4">
            {stripeId
              ? "Complete the onboarding process and start getting paid"
              : "Initiate the onboarding process and start getting paid"}
          </Typography>
          <Typography className={classes.text} color="textSecondary">
            Stripe is used to make sure you get paid on time and to keep your
            bank information and details secure. This will link your accounts
            and allow for a seamless experience between the two platforms while
            ensuring the highest levels of security, privacy and compliance.
          </Typography>
          <ListItems
            className={classes.list}
            items={renderOnboardingItems(stripeId)}
          />
          {!stripeId && (
            <Typography color="textSecondary" className={classes.label}>
              Please select your registered business address
            </Typography>
          )}
          <FormProvider control={control}>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
              {!stripeId && (
                <OnboardingForm
                  errors={errors}
                  getValues={getValues}
                  setValue={setValue}
                />
              )}
              <AsyncButton
                type="submit"
                color="secondary"
                fullWidth
                padding={!stripeId}
                submitting={formState.isSubmitting}
                disabled={!stripeId && isDisabled}
                startIcon={<OnboardIcon />}
              >
                Continue
              </AsyncButton>
            </form>
          </FormProvider>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OnboardingCard;
