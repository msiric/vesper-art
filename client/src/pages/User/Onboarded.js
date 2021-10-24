import { makeStyles } from "@material-ui/core";
import {
  PersonOutlineRounded as ProfileIcon,
  SupervisorAccountRounded as WelcomeIcon,
} from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
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
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const Onboarded = () => {
  const stripeId = useUserStore((state) => state.stripeId);
  const userUsername = useUserStore((state) => state.name);

  const globalClasses = globalStyles();
  const classes = useOnboardedStyles();

  console.log("STRIPEID", stripeId, userUsername);

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Card>
            <CardContent className={classes.content}>
              <WelcomeIcon className={classes.icon} />
              {stripeId ? (
                <>
                  <Typography className={classes.heading} variant="h4">
                    Congrats on completing the onboarding process
                  </Typography>
                  <Typography className={classes.text} color="textSecondary">
                    You can now upload commercially available artwork and choose
                    the pricing of the licenses you want to offer. Visit the
                    dashboard for an overview of your account's activity and
                    access your Stripe profile at any time.
                  </Typography>
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
                </>
              ) : (
                <Typography className={classes.heading} variant="h4">
                  Please complete the onboarding process
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Onboarded;
