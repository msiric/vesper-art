import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { emailValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useUserSettings } from "../../contexts/local/userSettings";
import EmailForm from "../../forms/EmailForm/index.js";
import settingsAccountStyles from "./styles.js";

const SettingsAccount = ({ handleLogout }) => {
  const user = useUserSettings((state) => state.user.data);
  const loading = useUserSettings((state) => state.user.loading);
  const updateEmail = useUserSettings((state) => state.updateEmail);

  const setDefaultValues = () => ({
    userEmail: loading ? "" : user.email,
  });

  const { handleSubmit, formState, errors, control, reset } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(emailValidation),
  });

  const onSubmit = async (values) =>
    await updateEmail({ userId: user.id, values, handleLogout });

  const classes = settingsAccountStyles();

  useEffect(() => {
    reset(setDefaultValues());
  }, [user.email]);

  return (
    <Card className={classes.artworkContainer} style={{ marginBottom: "16px" }}>
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <EmailForm errors={errors} />
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

export default SettingsAccount;
