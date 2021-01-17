import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Box,
  Button,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardRounded as ResetAvatar } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { passwordValidation } from "../../../../common/validation";
import EditPasswordForm from "../../forms/PasswordForm/index.js";
import { postReset } from "../../services/auth.js";

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
}));

const ResetPassword = ({ match }) => {
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
    defaultValues: {
      userCurrent: "",
      userPassword: "",
      userConfirm: "",
    },
    resolver: yupResolver(passwordValidation),
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

  return (
    <Container component="main" maxWidth="xs">
      <Box className={classes.paper}>
        <Avatar className={classes.avatar}>
          <ResetAvatar />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset your password
        </Typography>

        <FormProvider control={control}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <EditPasswordForm
                errors={errors}
                setValue={setValue}
                trigger={trigger}
                getValues={getValues}
                watch={watch}
              />
            </CardContent>
            <CardActions
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button component={Link} to="/login" color="primary">
                Log in
              </Button>
              <Button
                type="submit"
                color="primary"
                disabled={formState.isSubmitting}
              >
                Reset password
              </Button>
            </CardActions>
          </form>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default ResetPassword;
