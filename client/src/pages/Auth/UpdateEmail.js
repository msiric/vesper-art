import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core/styles";
import {
  AlternateEmailRounded as EmailIcon,
  MailOutlineRounded as EmailAvatar,
} from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { recoveryValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Link from "../../domain/Link";
import Typography from "../../domain/Typography";
import RecoveryForm from "../../forms/RecoveryForm/index";
import { postEmail } from "../../services/auth";
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

const UpdateEmail = () => {
  const setDefaultValues = () => ({
    userUsername: "",
    userPassword: "",
    userEmail: "",
  });

  const { handleSubmit, getValues, formState, errors, watch, control } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver: yupResolver(recoveryValidation),
    });

  const onSubmit = async (values) => {
    await postEmail.request({ data: values });
  };

  const classes = useStyles();

  watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.wrapper}>
        <Avatar className={classes.avatar}>
          <EmailAvatar />
        </Avatar>
        <Typography component="h1" variant="h5" className={classes.heading}>
          Update email
        </Typography>
        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <RecoveryForm getValues={getValues} errors={errors} />
            <AsyncButton
              type="submit"
              fullWidth
              padding
              submitting={formState.isSubmitting}
              disabled={isDisabled}
              startIcon={<EmailIcon />}
            >
              Update email
            </AsyncButton>
            <Grid container className={classes.actions}>
              <Grid item>
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

export default UpdateEmail;
