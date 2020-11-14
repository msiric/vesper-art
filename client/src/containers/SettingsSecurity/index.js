import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import AsyncButton from "../../components/AsyncButton/index.js";
import EditPasswordForm from "../../forms/PasswordForm/index.js";
import { passwordValidation } from "../../validation/password.js";
import settingsSecurityStyles from "./styles.js";

const SettingsSecurity = ({ handleUpdatePassword, loading }) => {
  const { handleSubmit, formState, errors, control } = useForm({
    defaultValues: {
      userCurrent: "",
      userPassword: "",
      userConfirm: "",
    },
    resolver: yupResolver(passwordValidation),
  });

  const onSubmit = async (values) => await handleUpdatePassword(values);

  const classes = settingsSecurityStyles();

  return (
    <Card className={classes.artworkContainer}>
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <EditPasswordForm errors={errors} />
          </CardContent>
          <CardActions
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <AsyncButton
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              padding
              loading={formState.isSubmitting}
              startIcon={<UploadIcon />}
            >
              Save
            </AsyncButton>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default SettingsSecurity;
