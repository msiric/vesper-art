import { Container, Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import MainHeading from "../../components/MainHeading/index.js";
import SettingsSection from "../../containers/SettingsSection/index.js";
import { UserContext } from "../../contexts/User.js";
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

const emailValidation = Yup.object().shape({
  userEmail: Yup.string()
    .email("Invalid email")
    .trim()
    .required("Email cannot be empty"),
});

const preferencesValidation = Yup.object().shape({
  userSaves: Yup.boolean().required("Saves need to have a value"),
});

const passwordValidation = Yup.object().shape({
  userCurrent: Yup.string().required("Enter your password"),
  userPassword: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .required("Enter new password"),
  userConfirm: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

const initialState = { loading: true, user: {} };

const Settings = ({ location }) => {
  const [userStore] = useContext(UserContext);
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
      formData.append(
        value,
        value === "userCountry" ? data[value].value : data[value]
      );
    }
    await patchUser.request({
      userId: userStore.id,
      data: formData,
    });
    setState((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        photo: values.userMedia,
        description: values.userDescription,
        country: values.userCountry ? values.userCountry.value : "",
      },
    }));
  };

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
        displaySaves: values.userSaves,
      },
    }));
  };

  const handleUpdatePassword = async (values, actions) => {
    await patchPassword.request({
      userId: userStore.id,
      data: values,
    });
    actions.resetForm();
  };

  const handleDeactivateUser = async () => {
    await deleteUser.request({ userId: userStore.id });
  };

  useEffect(() => {
    fetchSettings();
  }, [location]);

  return (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        {state.loading || state.user._id ? (
          <Grid item sm={12}>
            <MainHeading
              text={"Settings"}
              className={globalClasses.mainHeading}
            />
            <SettingsSection
              user={state.user}
              handleUpdateProfile={handleUpdateProfile}
              handleUpdateEmail={handleUpdateEmail}
              handleUpdatePreferences={handleUpdatePreferences}
              handleUpdatePassword={handleUpdatePassword}
              handleDeactivateUser={handleDeactivateUser}
              loading={state.loading}
            />
          </Grid>
        ) : (
          history.push("/")
        )}
      </Grid>
    </Container>
  );
};

export default Settings;
