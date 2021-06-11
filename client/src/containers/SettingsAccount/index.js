import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent } from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { emailValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import { useUserSettings } from "../../contexts/local/userSettings";
import Card from "../../domain/Card";
import EmailForm from "../../forms/EmailForm/index.js";
import { socket } from "../Interceptor/Interceptor";
import settingsAccountStyles from "./styles.js";

const SettingsAccount = ({ handleLogout }) => {
  const resetUser = useUserStore((state) => state.resetUser);
  const resetEvents = useEventsStore((state) => state.resetEvents);

  const user = useUserSettings((state) => state.user.data);
  const loading = useUserSettings((state) => state.user.loading);
  const updateEmail = useUserSettings((state) => state.updateEmail);

  const history = useHistory();

  const classes = settingsAccountStyles();

  const setDefaultValues = () => ({
    userEmail: loading ? "" : user.email,
  });

  const { handleSubmit, formState, errors, control, reset } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(emailValidation),
  });

  const onSubmit = async (values) => {
    await updateEmail({ userId: user.id, values, handleLogout });
    socket.instance.emit("disconnectUser");
    resetUser();
    resetEvents();
    history.push("/login");
  };

  useEffect(() => {
    reset(setDefaultValues());
  }, [user.email]);

  return (
    <Card className={classes.container}>
      <FormProvider control={control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <EmailForm errors={errors} />
          </CardContent>
          <CardActions className={classes.settingsActions}>
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

export default SettingsAccount;
