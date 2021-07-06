import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { passwordValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import { useUserSettings } from "../../contexts/local/userSettings";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import EditPasswordForm from "../../forms/PasswordForm/index";
import settingsSecurityStyles from "./styles";

const SettingsSecurity = ({ handleLogout }) => {
  const userId = useUserSettings((state) => state.user.data.id);
  const loading = useUserSettings((state) => state.user.loading);
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
    <Card>
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <EditPasswordForm errors={errors} loading={loading} />
          </CardContent>
          <CardActions className={classes.actions}>
            <AsyncButton
              type="submit"
              fullWidth
              submitting={formState.isSubmitting}
              loading={loading}
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
