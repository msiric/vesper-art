import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExitToAppOutlined as SignupIcon,
  MeetingRoomRounded as SignupAvatar,
} from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { signupValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Link from "../../domain/Link";
import Typography from "../../domain/Typography";
import SignupForm from "../../forms/SignupForm/index";
import { postSignup } from "../../services/auth";
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

const Signup = () => {
  const setDefaultValues = () => ({
    userName: "",
    userUsername: "",
    userEmail: "",
    userPassword: "",
    userConfirm: "",
  });

  const { handleSubmit, getValues, formState, errors, watch, control } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver: yupResolver(signupValidation),
    });

  const history = useHistory();

  const onSubmit = async (values) => {
    await postSignup.request({ data: values });
    history.push("/login");
  };

  const classes = useStyles();

  const watchedValues = watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.wrapper}>
        <Avatar className={classes.avatar}>
          <SignupAvatar />
        </Avatar>
        <Typography component="h1" variant="h5" className={classes.heading}>
          Sign up
        </Typography>
        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <SignupForm errors={errors} />
            <AsyncButton
              type="submit"
              fullWidth
              padding
              submitting={formState.isSubmitting}
              disabled={isDisabled}
              startIcon={<SignupIcon />}
            >
              Sign up
            </AsyncButton>
            <Grid container className={classes.actions}>
              <Grid item>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  color="secondary"
                >
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default Signup;
