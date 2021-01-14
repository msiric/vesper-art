import { Container, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MainHeading from "../../components/MainHeading/index.js";
import PromptModal from "../../components/PromptModal/index.js";
import SettingsAccount from "../../containers/SettingsAccount/index.js";
import SettingsActions from "../../containers/SettingsActions/index.js";
import SettingsPreferences from "../../containers/SettingsPreferences/index.js";
import SettingsProfile from "../../containers/SettingsProfile/index.js";
import SettingsSecurity from "../../containers/SettingsSecurity/index.js";
import { useTracked as useUserContext } from "../../contexts/User.js";
import {
  deleteUser,
  getSettings,
  patchEmail,
  patchPassword,
  patchPreferences,
  patchUser,
} from "../../services/user.js";
import globalStyles from "../../styles/global.js";
import { deleteEmptyValues } from "../../utils/helpers.js";

const initialState = {
  loading: true,
  user: { avatar: {} },
  modal: { open: false },
  isDeactivating: false,
};

const Settings = ({ location }) => {
  const [userStore] = useUserContext();
  const [state, setState] = useState({
    ...initialState,
  });
  const history = useHistory();

  const globalClasses = globalStyles();

  const fetchSettings = async () => {
    try {
      setState({ ...initialState });
      const { data } = await getSettings.request({ userId: userStore.id });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        user: data.user,
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleUpdateProfile = async (values) => {
    const data = deleteEmptyValues(values);
    const formData = new FormData();
    for (let value of Object.keys(data)) {
      formData.append(value, data[value]);
    }
    await patchUser.request({
      userId: userStore.id,
      data: formData,
    });
    setState((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        avatar: values.userMedia,
        description: values.userDescription,
        country: values.userCountry,
      },
    }));
  };

  // $TODO LOG USER OUT AFTER EMAIL UPDATE
  const handleUpdateEmail = async (values) => {
    await patchEmail.request({
      userId: userStore.id,
      data: values,
    });
    setState((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        email: values.email,
        verified: false,
      },
    }));
  };

  const handleUpdatePreferences = async (values) => {
    await patchPreferences.request({
      userId: userStore.id,
      data: values,
    });
    setState((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        displayFavorites: values.userFavorites,
      },
    }));
  };

  // $TODO LOG USER OUT AFTER PASSWORD UPDATE
  const handleUpdatePassword = async (values, reset) => {
    await patchPassword.request({
      userId: userStore.id,
      data: values,
    });
    reset();
  };

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: { ...prevState.modal, open: true },
    }));
  };

  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: { ...prevState.modal, open: false },
    }));
  };

  const handleDeactivateUser = async () => {
    try {
      setState((prevState) => ({ ...prevState, isDeactivating: true }));
      await deleteUser.request({ userId: userStore.id });
    } catch (err) {
    } finally {
      setState((prevState) => ({ ...prevState, isDeactivating: false }));
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [location]);

  return (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        {state.loading || state.user.id ? (
          <Grid item sm={12}>
            <MainHeading
              text="Settings"
              className={globalClasses.mainHeading}
            />

            <Grid container p={0} my={4} spacing={2}>
              <Grid
                item
                xs={12}
                md={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <SettingsProfile
                  user={state.user}
                  handleUpdateProfile={handleUpdateProfile}
                  loading={state.loading}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={8}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <SettingsAccount
                  user={state.user}
                  handleUpdateEmail={handleUpdateEmail}
                  loading={state.loading}
                />
                <SettingsPreferences
                  user={state.user}
                  handleUpdatePreferences={handleUpdatePreferences}
                  loading={state.loading}
                />
                <SettingsSecurity
                  handleUpdatePassword={handleUpdatePassword}
                  loading={state.loading}
                />
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <SettingsActions
                  handleModalOpen={handleModalOpen}
                  loading={state.loading}
                />
              </Grid>
            </Grid>
          </Grid>
        ) : (
          history.push("/")
        )}
      </Grid>
      <PromptModal
        open={state.modal.open}
        handleConfirm={handleDeactivateUser}
        handleClose={handleModalClose}
        ariaLabel="Deactivate account"
        promptTitle="Are you sure you want to deactivate your account?"
        promptConfirm="Deactivate"
        promptCancel="Cancel"
        isSubmitting={state.isDeactivating}
      />
    </Container>
  );
};

export default Settings;
