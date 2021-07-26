import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { isFormAltered } from "../../../../common/helpers";
import {
  avatarValidation,
  profileValidation,
} from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import { useUserStore } from "../../contexts/global/user";
import { useUserSettings } from "../../contexts/local/userSettings";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import EditUserForm from "../../forms/UserForm/index";
import settingsProfileStyles from "./styles";

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
    watch,
    reset,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(profileValidation.concat(avatarValidation)),
  });

  const onSubmit = async (values) =>
    await updateProfile({ userId: user.id, values });

  const watchedValues = watch();

  const classes = settingsProfileStyles();

  const isDisabled =
    !isFormAltered(getValues(), setDefaultValues()) || formState.isSubmitting;

  useEffect(() => {
    fetchSettings({ userId });
  }, []);

  useEffect(() => {
    reset(setDefaultValues());
  }, [user.avatar, user.description, user.country]);

  return (
    <Card className={classes.container}>
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <CardContent className={classes.content}>
            <EditUserForm
              preview={user.avatar && user.avatar.source}
              errors={errors}
              getValues={getValues}
              setValue={setValue}
              trigger={trigger}
              editable={true}
              loading={loading}
              userName={user.fullName}
            />
          </CardContent>
          <CardActions className={classes.actions}>
            <AsyncButton
              type="submit"
              fullWidth
              submitting={formState.isSubmitting}
              disabled={isDisabled}
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

export default SettingsProfile;
