import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { countries } from "../../../../common/constants.js";
import AsyncButton from "../../components/AsyncButton/index.js";
import EditUserForm from "../../forms/UserForm/index.js";
import { patchAvatar } from "../../validation/media.js";
import { profileValidation } from "../../validation/profile.js";
import settingsProfileStyles from "./styles.js";

const SettingsProfile = ({ user, handleUpdateProfile, loading }) => {
  const setDefaultValues = () => ({
    userMedia: "",
    userDescription: user.description || "",
    userCountry: user.country
      ? countries.find((country) => country.value === user.country)
      : "",
  });

  const {
    handleSubmit,
    formState,
    errors,
    control,
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <EditUserForm
              preview={user.photo}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
              loading={loading}
            />
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

export default SettingsProfile;
