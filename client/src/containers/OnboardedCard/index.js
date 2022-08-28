import { useUserOnboarded } from "@contexts/local/userOnboarded";
import Box from "@domain/Box";
import {
  LabelImportantRounded as LabelIcon,
  MonetizationOnRounded as MonetizationIcon,
  PersonOutlineRounded as ProfileIcon,
  SupervisorAccountRounded as WelcomeIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { appName } from "../../../../common/constants";
import ListItems from "../../components/ListItems/index";
import SyncButton from "../../components/SyncButton";
import { useUserStore } from "../../contexts/global/user";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Typography from "../../domain/Typography";
import onboardedCardStyles from "./styles";

const renderOnboardedItems = (onboarded) => [
  {
    icon: <LabelIcon />,
    label: onboarded
      ? "Access your dashboard for an overview of your recent activities"
      : "Provide information about your personal and professional details",
  },
  {
    icon: <LabelIcon />,
    label: onboarded
      ? "Upload your artwork and choose what kind of interactions you want allow or restrict"
      : "Select an account that will be used to issue payouts once you start earning",
  },
  {
    icon: <LabelIcon />,
    label: onboarded
      ? "Set how much to charge for your artworks' personal and commercial licenses"
      : "Submit the required identity document to get verified",
  },
  {
    icon: <LabelIcon />,
    label: onboarded
      ? `Transfer your earnings from ${appName} to your bank account`
      : "If all the steps were completed, the verification process might still be ongoing",
  },
];

const OnboardedCard = () => {
  const stripeId = useUserStore((state) => state.stripeId);
  const userUsername = useUserStore((state) => state.name);
  const onboarded = useUserOnboarded((state) => state.details.data);
  const loading = useUserOnboarded((state) => state.details.loading);
  const fetchDetails = useUserOnboarded((state) => state.fetchDetails);

  const history = useHistory();

  const classes = onboardedCardStyles();

  useEffect(() => {
    if (userUsername) {
      if (!stripeId) {
        history.push("/onboarding");
      } else {
        fetchDetails();
      }
    }
  }, [userUsername, stripeId]);

  return (
    <Card>
      <CardContent className={classes.content}>
        <WelcomeIcon className={classes.icon} />
        <Typography className={classes.heading} variant="h4" loading={loading}>
          {onboarded
            ? "Congratulations on completing the onboarding process"
            : "Onboarding process in progress but not yet finalized"}
        </Typography>
        <Typography
          className={classes.text}
          color="textSecondary"
          loading={loading}
        >
          {onboarded
            ? "You can now upload commercially available artwork, have full control of the level of interaction you want to allow and choose the pricing of the licenses you want to offer. Visit the dashboard for an overview of your account's activities and access your Stripe profile at any time."
            : "There are still steps you need to go through before the onboarding process is finalized. Make sure to submit all the required information to Stripe and uploaded all the necessary documents for verification, if needed. Check the list below to understand what you might have missed."}
        </Typography>
        <ListItems
          className={classes.list}
          items={renderOnboardedItems(onboarded)}
          loading={loading}
        />
        <Box className={classes.wrapper}>
          <Typography
            color="textSecondary"
            className={classes.label}
            loading={loading}
          >
            {onboarded
              ? "Go to your profile page"
              : "Continue the onboarding process"}
          </Typography>
          <SyncButton
            component={RouterLink}
            to={onboarded ? `/user/${userUsername}` : "/onboarding"}
            startIcon={onboarded ? <ProfileIcon /> : <MonetizationIcon />}
            loading={loading}
            fullWidth
          >
            Visit
          </SyncButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OnboardedCard;
