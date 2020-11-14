import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AsyncButton from "../../components/AsyncButton/index.js";
import EditPreferencesForm from "../../forms/PreferencesForm/index.js";
import { preferencesValidation } from "../../validation/preferences.js";
import settingsPreferencesStyles from "./styles.js";

const SettingsPreferences = ({ user, handleUpdatePreferences, loading }) => {
  const setDefaultValues = () => ({
    userSaves: loading ? false : user.displaySaves,
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

  const onSubmit = async (values) => await handleUpdatePreferences(values);

  const classes = settingsPreferencesStyles();

  useEffect(() => {
    reset(setDefaultValues());
  }, [user.displaySaves]);

  return (
    <Card className={classes.artworkContainer} style={{ marginBottom: "16px" }}>
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <EditPreferencesForm
              setValue={setValue}
              getValues={getValues}
              errors={errors}
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

export default SettingsPreferences;
