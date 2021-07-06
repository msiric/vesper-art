import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core/styles";
import { LinkRounded as TokenAvatar } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { emailValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Link from "../../domain/Link";
import Typography from "../../domain/Typography";
import EmailForm from "../../forms/EmailForm/index";
import { postResend } from "../../services/auth";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const ResendToken = () => {
  const { handleSubmit, formState, errors, control } = useForm({
    defaultValues: {
      userEmail: "",
    },
    resolver: yupResolver(emailValidation),
  });

  const history = useHistory();
  const classes = useStyles();

  const onSubmit = async (values) => {
    try {
      await postResend.request({ data: values });
      history.push({
        pathname: "/login",
        state: { message: "Verification link sent to your email" },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <TokenAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Resend verification token
        </Typography>
        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <EmailForm errors={errors} />
            </CardContent>
            <CardActions className={classes.actions}>
              <AsyncButton
                type="submit"
                fullWidth
                className={classes.submit}
                disabled={formState.isSubmitting}
              >
                Send verification token
              </AsyncButton>
            </CardActions>
            <Grid container>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/account_restoration"
                  variant="body2"
                >
                  Back to account restoration
                </Link>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default ResendToken;
