import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core/styles";
import {
  LinkRounded as TokenAvatar,
  MailOutlineRounded as TokenIcon,
} from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { emailValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Link from "../../domain/Link";
import Typography from "../../domain/Typography";
import EmailForm from "../../forms/EmailForm/index";
import { postResend } from "../../services/auth";
import { isFormDisabled } from "../../utils/helpers";

const useStyles = makeStyles((muiTheme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: muiTheme.spacing(1),
    backgroundColor: muiTheme.palette.primary.main,
  },
  form: {
    width: "100%",
  },
  actions: {
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  heading: {
    textAlign: "center",
  },
}));

const ResendToken = () => {
  const setDefaultValues = () => ({
    userEmail: "",
  });

  const { handleSubmit, getValues, formState, errors, watch, control } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver: yupResolver(emailValidation),
    });

  const history = useHistory();
  const classes = useStyles();

  const watchedValues = watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  const onSubmit = async (values) => {
    await postResend.request({ data: values });
    history.push({
      pathname: "/login",
      state: { message: "Verification link sent to your email" },
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.wrapper}>
        <Avatar className={classes.avatar}>
          <TokenAvatar />
        </Avatar>
        <Typography component="h1" variant="h5" className={classes.heading}>
          Resend verification token
        </Typography>
        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <EmailForm errors={errors} />
            <AsyncButton
              type="submit"
              fullWidth
              padding
              submitting={formState.isSubmitting}
              disabled={isDisabled}
              startIcon={<TokenIcon />}
            >
              Send verification token
            </AsyncButton>
            <Grid container className={classes.actions}>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/account_restoration"
                  variant="body2"
                  color="secondary"
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
