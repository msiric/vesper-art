import { makeStyles } from "@material-ui/core/styles";
import { HelpRounded as RecoveryAvatar } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as ChangeEmail } from "../../assets/images/illustrations/change_email.svg";
import { ReactComponent as ForgotPassword } from "../../assets/images/illustrations/forgot_password.svg";
import { ReactComponent as VerifyAccount } from "../../assets/images/illustrations/verify_account.svg";
import RestorationCard from "../../components/RestorationCard";
import Avatar from "../../domain/Avatar";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Link from "../../domain/Link";
import Typography from "../../domain/Typography";

const RESTORATION_CARDS = [
  {
    illustration: <ForgotPassword />,
    title: "Forgot password?",
    text: "You can reset your password by receiving a reset token to your linked email",
    redirect: "/forgot_password",
  },
  {
    illustration: <VerifyAccount />,
    title: "Verify account?",
    text: "If you haven't received a verification token to your linked email, you can request a new one",
    redirect: "/resend_token",
  },
  {
    illustration: <ChangeEmail />,
    title: "Change email?",
    text: "If you typed in a wrong email or you're locked out of one, you can try updating it here",
    redirect: "/update_email",
  },
];

const useStyles = makeStyles((muiTheme) => ({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  headerWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    margin: muiTheme.spacing(1),
    backgroundColor: muiTheme.palette.primary.main,
  },
  content: {
    padding: "12px 0",
  },
  actions: {
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
}));

const AccountRestoration = () => {
  const classes = useStyles();

  return (
    <Container>
      <Grid container spacing={2} className={classes.wrapper}>
        <Grid item xs={12} className={classes.headerWrapper}>
          <Avatar className={classes.avatar}>
            <RecoveryAvatar />
          </Avatar>
          <Typography component="h1" variant="h5">
            Account restoration
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.content}>
        {RESTORATION_CARDS.map((card) => (
          <Grid item xs={12} sm={4}>
            <RestorationCard {...card} />
          </Grid>
        ))}
      </Grid>
      <Grid container className={classes.actions}>
        <Grid item xs>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            color="secondary"
          >
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
