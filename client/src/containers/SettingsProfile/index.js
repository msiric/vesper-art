import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { patchAvatar, profileValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useUserStore } from "../../contexts/global/user";
import { useUserSettings } from "../../contexts/local/userSettings";
import EditUserForm from "../../forms/UserForm/index.js";
import settingsProfileStyles from "./styles.js";

const SettingsProfile = () => {
  const userId = useUserStore((state) => state.id);

  const user = useUserSettings((state) => state.user.data);
  const loading = useUserSettings((state) => state.user.loading);
  const updateProfile = useUserSettings((state) => state.updateProfile);
  const fetchSettings = useUserSettings((state) => state.fetchSettings);

  const setDefaultValues = () => ({
    userMedia: "",
    userDescription: loading ? "" : user.description || "",
    userCountry: loading ? "" : user.country || "",
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
    getValues,
    setValue,
    trigger,
    reset,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(profileValidation.concat(patchAvatar)),
  });

  const onSubmit = async (values) =>
    await updateProfile({ userId: user.id, values });

  const classes = settingsProfileStyles();

  useEffect(() => {
    fetchSettings({ userId });
  }, []);

  useEffect(() => {
    reset(setDefaultValues());
  }, [user.description, user.country]);

  return (
    <Card
      className={classes.artworkContainer}
      style={{
        height: "100%",
      }}
    >
      <FormProvider control={control}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.settingsProfileForm}
        >
          <CardContent className={classes.settingsProfileContent}>
            <EditUserForm
              preview={user.avatar && user.avatar.source}
              errors={errors}
              getValues={getValues}
              setValue={setValue}
              trigger={trigger}
              loading={loading}
            />
          </CardContent>
          <CardActions className={classes.settingsProfileActions}>
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

export default SettingsProfile;
