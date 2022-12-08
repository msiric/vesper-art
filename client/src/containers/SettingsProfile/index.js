import { yupResolver } from "@hookform/resolvers/yup";
import { CheckRounded as SaveIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
import { isFormDisabled } from "../../utils/helpers";
import settingsProfileStyles from "./styles";

const SettingsProfile = () => {
  const userId = useUserStore((state) => state.id);

  const user = useUserSettings((state) => state.user.data);
  const loading = useUserSettings((state) => state.user.loading);
  const updateProfile = useUserSettings((state) => state.updateProfile);
  const fetchSettings = useUserSettings((state) => state.fetchSettings);

  const setDefaultValues = () => ({
    userMedia: loading ? "" : user.avatar || "",
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

  watch();

  const classes = settingsProfileStyles();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  useEffect(() => {
    fetchSettings({ userId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    reset(setDefaultValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              editable
              loading={loading}
              userName={user.fullName}
              userUsername={user.name}
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

export default SettingsProfile;
