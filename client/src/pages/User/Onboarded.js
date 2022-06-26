import { makeStyles } from "@material-ui/core";
import {
  LabelImportantRounded as LabelIcon,
  PersonOutlineRounded as ProfileIcon,
  SupervisorAccountRounded as WelcomeIcon,
} from "@material-ui/icons";
import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { appName } from "../../../../common/constants";
import ListItems from "../../components/ListItems/index";
import SyncButton from "../../components/SyncButton";
import { useUserStore } from "../../contexts/global/user";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useOnboardedStyles = makeStyles((muiTheme) => ({
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
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const onboardedItems = [
  {
    icon: <LabelIcon />,
    label: "Access your dashboard for an overview of your recent activities",
  },
  {
    icon: <LabelIcon />,
    label:
      "Upload your artwork and choose what kind of interactions you want allow or restrict",
  },
  {
    icon: <LabelIcon />,
    label:
      "Set how much to charge for your artworks' personal and commercial licenses",
  },
  {
    icon: <LabelIcon />,
    label: `Transfer your earnings from ${appName} to your bank account`,
  },
];

const Onboarded = () => {
  const stripeId = useUserStore((state) => state.stripeId);
  const userUsername = useUserStore((state) => state.name);

  const history = useHistory();

  const globalClasses = globalStyles();
  const classes = useOnboardedStyles();

  if (userUsername && !stripeId) {
    history.push("/onboarding");
  }

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Card>
            <CardContent className={classes.content}>
              <WelcomeIcon className={classes.icon} />
              <Typography className={classes.heading} variant="h4">
                Congrats on completing the onboarding process
              </Typography>
              <Typography className={classes.text} color="textSecondary">
                You can now upload commercially available artwork, have full
                control of the level of interaction you want to allow and choose
                the pricing of the licenses you want to offer. Visit the
                dashboard for an overview of your account's activities and
                access your Stripe profile at any time.
              </Typography>
              <ListItems className={classes.list} items={onboardedItems} />
              <Typography color="textSecondary" className={classes.label}>
                Go to your profile page
              </Typography>
              <SyncButton
                component={RouterLink}
                to={`/user/${userUsername}`}
                startIcon={<ProfileIcon />}
              >
                Visit
              </SyncButton>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Onboarded;
