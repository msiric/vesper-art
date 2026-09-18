import { yupResolver } from "@hookform/resolvers/yup";
import { CheckRounded as SaveIcon } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { passwordValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import { useUserSettings } from "../../contexts/local/userSettings";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import PasswordForm from "../../forms/PasswordForm/index";
import { isFormDisabled } from "../../utils/helpers";
import settingsSecurityStyles from "./styles";

const SettingsSecurity = ({ handleLogout }) => {
  const userId = useUserSettings((state) => state.user.data.id);
  const loading = useUserSettings((state) => state.user.loading);
  const updatePassword = useUserSettings((state) => state.updatePassword);

  const setDefaultValues = () => ({
    userCurrent: "",
    userPassword: "",
    userConfirm: "",
  });

  const { handleSubmit, formState, errors, control, watch, getValues } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver: yupResolver(passwordValidation),
    });

  const onSubmit = async (values) =>
    await updatePassword({ userId, values, handleLogout });

  const classes = settingsSecurityStyles();

  watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  return (
    <Card className={classes.container}>
      <FormProvider control={control}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <PasswordForm
              getValues={getValues}
              errors={errors}
              loading={loading}
            />
          </CardContent>
          <CardActions className={classes.actions}>
            <AsyncButton
              type="submit"
              fullWidth
              submitting={formState.isSubmitting}
              disabled={isDisabled}
              loading={loading}
              startIcon={<SaveIcon />}
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
