import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardRounded as ResetAvatar } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { isFormAltered } from "../../../../common/helpers";
import { resetValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Typography from "../../domain/Typography";
import ResetPasswordForm from "../../forms/ResetForm";
import { postReset } from "../../services/auth";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%",
  },
}));

const ResetPassword = ({ match }) => {
  const setDefaultValues = () => ({
    userPassword: "",
    userConfirm: "",
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    trigger,
    getValues,
    watch,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(resetValidation),
  });

  const history = useHistory();

  const classes = useStyles();

  const onSubmit = async (values) => {
    try {
      await postReset.request({ resetToken: match.params.id, data: values });
      history.push({
        pathname: "/login",
        state: { message: "Password successfully changed" },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const watchedValues = watch();

  const isDisabled =
    !isFormAltered(getValues(), setDefaultValues()) || formState.isSubmitting;

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.wrapper}>
        <Avatar className={classes.avatar}>
          <ResetAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset your password
        </Typography>
        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <ResetPasswordForm
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              getValues={getValues}
              watch={watch}
            />
            <AsyncButton
              type="submit"
              fullWidth
              padding
              submitting={formState.isSubmitting}
              disabled={isDisabled}
            >
              Reset password
            </AsyncButton>
          </form>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default ResetPassword;
