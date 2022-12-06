import { yupResolver } from "@hookform/resolvers/yup";
import { CardActions, CardContent } from "@material-ui/core";
import { CheckRounded as SaveIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { emailValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import { useUserSettings } from "../../contexts/local/userSettings";
import Card from "../../domain/Card";
import EmailForm from "../../forms/EmailForm/index";
import { isFormDisabled } from "../../utils/helpers";
import { socket } from "../Interceptor";
import settingsAccountStyles from "./styles";

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

  const { handleSubmit, getValues, formState, errors, control, watch, reset } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver: yupResolver(emailValidation),
    });

  const onSubmit = async (values) => {
    await updateEmail({ userId: user.id, values, handleLogout });
    if (socket?.instance) socket.instance.emit("disconnectUser");
    resetUser();
    resetEvents();
    history.push("/login");
  };

  const watchedValues = watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  useEffect(() => {
    reset(setDefaultValues());
  }, [user.email]);

  return (
    <Card className={classes.container}>
      <FormProvider control={control}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <EmailForm errors={errors} loading={loading} />
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

export default SettingsAccount;
