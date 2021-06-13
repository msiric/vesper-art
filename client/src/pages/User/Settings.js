import { Container, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import MainHeading from "../../components/MainHeading/index.js";
import { socket } from "../../containers/Interceptor/Interceptor";
import SettingsAccount from "../../containers/SettingsAccount/index.js";
import SettingsActions from "../../containers/SettingsActions/index.js";
import SettingsPreferences from "../../containers/SettingsPreferences/index.js";
import SettingsProfile from "../../containers/SettingsProfile/index.js";
import SettingsSecurity from "../../containers/SettingsSecurity/index.js";
import SettingsWrapper from "../../containers/SettingsWrapper/index.js";
import { useEventsStore } from "../../contexts/global/events.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useUserSettings } from "../../contexts/local/userSettings";
import { postLogout } from "../../services/user.js";
import globalStyles from "../../styles/global.js";

const Settings = ({ location }) => {
  // $TODO Update user store on every change in settings (ex. avatar change)
  const userId = useUserStore((state) => state.id);
  const resetUser = useUserStore((state) => state.resetUser);

  const resetEvents = useEventsStore((state) => state.resetEvents);

  const resetSettings = useUserSettings((state) => state.resetSettings);

  const history = useHistory();
  const globalClasses = globalStyles();

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

  return (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <MainHeading text="Settings" className={globalClasses.mainHeading} />
          <Grid container p={0} my={4} spacing={2}>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <SettingsProfile />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={8}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <SettingsAccount handleLogout={handleLogout} />
              <SettingsPreferences />
              <SettingsSecurity handleLogout={handleLogout} />
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <SettingsActions />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <SettingsWrapper />
    </Container>
  );
};

export default Settings;
