import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { preferencesValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useUserSettings } from "../../contexts/local/userSettings";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import EditPreferencesForm from "../../forms/PreferencesForm/index.js";
import settingsPreferencesStyles from "./styles.js";

const SettingsPreferences = () => {
  const user = useUserSettings((state) => state.user.data);
  const loading = useUserSettings((state) => state.user.loading);
  const updatePreferences = useUserSettings((state) => state.updatePreferences);

  const setDefaultValues = () => ({
    userFavorites: loading ? false : user.displayFavorites,
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(preferencesValidation),
  });

  const onSubmit = async (values) =>
    await updatePreferences({ userId: user.id, values });

  const classes = settingsPreferencesStyles();

  useEffect(() => {
    reset(setDefaultValues());
  }, [user.displayFavorites]);

  return (
    <Card className={classes.container}>
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <EditPreferencesForm
              setValue={setValue}
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

export default SettingsPreferences;
