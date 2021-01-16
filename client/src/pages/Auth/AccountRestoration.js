import { Avatar, Container, Grid, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { HelpRounded as RecoveryAvatar } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as ChangeEmail } from "../../assets/images/illustrations/change_email.svg";
import { ReactComponent as ForgotPassword } from "../../assets/images/illustrations/forgot_password.svg";
import { ReactComponent as VerifyAccount } from "../../assets/images/illustrations/verify_account.svg";
import RestorationCard from "../../components/RestorationCard";
import globalStyles from "../../styles/global.js";

const RESTORATION_CARDS = [
  {
    illustration: <ForgotPassword />,
    title: "Forgot password?",
    text:
      "You can reset your password by receiving a reset token to your linked email",
    redirect: "/forgot_password",
  },
  {
    illustration: <VerifyAccount />,
    title: "Verify account?",
    text:
      "If you haven't received a verification token to your linked email, you can request a new one",
    redirect: "/resend_token",
  },
  {
    illustration: <ChangeEmail />,
    title: "Change email?",
    text:
      "If you typed in a wrong email or you're locked out of one, you can try updating it here",
    redirect: "/update_email",
  },
];

const useStyles = makeStyles((theme) => ({
  gridWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
}));

const AccountRestoration = () => {
  const classes = useStyles();
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container className={classes.gridWrapper}>
        <Grid item sm={12} className={classes.cardHeader}>
          <Avatar className={classes.avatar}>
            <RecoveryAvatar />
          </Avatar>
          <Typography component="h1" variant="h5">
            Account restoration
          </Typography>
        </Grid>
        {RESTORATION_CARDS.map((card) => (
          <Grid item sm={12} md={3}>
            <RestorationCard {...card} />
          </Grid>
        ))}
      </Grid>
      <Grid container>
        <Grid item xs>
          <Link component={RouterLink} to="/login" variant="body2">
            Back to login
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to="/signup" variant="body2">
            Don't have an account? Sign Up
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountRestoration;
