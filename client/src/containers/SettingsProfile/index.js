import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AsyncButton from "../../components/AsyncButton/index.js";
import EditUserForm from "../../forms/UserForm/index.js";
import { patchAvatar } from "../../validation/media.js";
import { profileValidation } from "../../validation/profile.js";
import settingsProfileStyles from "./styles.js";

const SettingsProfile = ({ user, handleUpdateProfile, loading }) => {
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

  const onSubmit = async (values) => await handleUpdateProfile(values);

  const classes = settingsProfileStyles();

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
              preview={user.source}
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
