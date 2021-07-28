import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import MainHeading from "../../components/MainHeading/index";
import { socket } from "../../containers/Interceptor/indexx";
import SettingsAccount from "../../containers/SettingsAccount/index";
import SettingsActions from "../../containers/SettingsActions/index";
import SettingsPreferences from "../../containers/SettingsPreferences/index";
import SettingsProfile from "../../containers/SettingsProfile/index";
import SettingsSecurity from "../../containers/SettingsSecurity/index";
import SettingsWrapper from "../../containers/SettingsWrapper/index";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import { useUserSettings } from "../../contexts/local/userSettings";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import { postLogout } from "../../services/user";
import globalStyles from "../../styles/global";
import { containsErrors, renderError } from "../../utils/helpers";

const useSettingsStyles = makeStyles((muiTheme) => ({
  container: {
    width: "100%",
    padding: 0,
    margin: "16px 0",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
}));

const Settings = ({ location }) => {
  // $TODO Update user store on every change in settings (ex. avatar change)
  const userId = useUserStore((state) => state.id);
  const resetUser = useUserStore((state) => state.resetUser);

  const resetEvents = useEventsStore((state) => state.resetEvents);

  const retry = useUserSettings((state) => state.user.error.retry);
  const redirect = useUserSettings((state) => state.user.error.redirect);
  const message = useUserSettings((state) => state.user.error.message);
  const resetSettings = useUserSettings((state) => state.resetSettings);

  const history = useHistory();

  const globalClasses = globalStyles();
  const classes = useSettingsStyles();

  const handleLogout = async () => {
    await postLogout.request();
    // $TODO verify that socket is defined
    socket.instance.emit("disconnectUser");
    resetUser();
    resetEvents();
    history.push("/login");
  };

  const reinitializeState = () => {
    resetSettings();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return !containsErrors(retry, redirect) ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <MainHeading text="Settings" className={globalClasses.mainHeading} />
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12} sm={6} md={4} className={classes.wrapper}>
          <SettingsProfile />
        </Grid>
        <Grid item xs={12} sm={6} md={8} className={classes.wrapper}>
          <SettingsAccount handleLogout={handleLogout} />
          <SettingsPreferences />
          <SettingsSecurity handleLogout={handleLogout} />
        </Grid>
        <Grid item xs={12} className={classes.wrapper}>
          <SettingsActions />
        </Grid>
      </Grid>
      <SettingsWrapper />
    </Container>
  ) : (
    renderError({ retry, redirect, message, reinitializeState })
  );
};

export default Settings;
