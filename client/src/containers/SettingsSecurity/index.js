import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { passwordValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useUserSettings } from "../../contexts/local/userSettings";
import EditPasswordForm from "../../forms/PasswordForm/index.js";
import settingsSecurityStyles from "./styles.js";

const SettingsSecurity = ({ handleLogout }) => {
  const userId = useUserSettings((state) => state.user.data.id);
  const updatePassword = useUserSettings((state) => state.updatePassword);

  const { handleSubmit, formState, errors, control, reset } = useForm({
    defaultValues: {
      userCurrent: "",
      userPassword: "",
      userConfirm: "",
    },
    resolver: yupResolver(passwordValidation),
  });

  const onSubmit = async (values) =>
    await updatePassword({ userId, values, handleLogout });

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
