import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core/styles";
import { MailOutlineRounded as EmailAvatar } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { recoveryValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Link from "../../domain/Link";
import Typography from "../../domain/Typography";
import RecoveryForm from "../../forms/RecoveryForm/index.js";
import { postEmail } from "../../services/auth.js";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

const UpdateEmail = () => {
  const { handleSubmit, formState, errors, control } = useForm({
    defaultValues: {
      userUsername: "",
      userPassword: "",
      userEmail: "",
    },
    resolver: yupResolver(recoveryValidation),
  });

  const onSubmit = async (values) => {
    try {
      await postEmail.request({ data: values });
      /*         enqueueSnackbar('Verification email sent', {
          variant: 'success',
          autoHideDuration: 1000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        }); */
    } catch (err) {
      console.log(err);
    }
  };

  const history = useHistory();
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.wrapper}>
        <Avatar className={classes.avatar}>
          <EmailAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Update email
        </Typography>
        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RecoveryForm errors={errors} />
            <AsyncButton
              type="submit"
              fullWidth
              padding
              submitting={formState.isSubmitting}
            >
              Update email
            </AsyncButton>
            <Grid container>
              <Grid item>
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

export default UpdateEmail;
