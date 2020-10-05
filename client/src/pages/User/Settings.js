import { Container, Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import MainHeading from "../../components/MainHeading/MainHeading.js";
import SettingsSection from "../../containers/SettingsSection/SettingsSection.js";
import { Context } from "../../context/Store.js";
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

const Settings = () => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    user: {},
  });
  const history = useHistory();

  const globalClasses = globalStyles();

  const fetchSettings = async () => {
    try {
      const { data } = await getSettings({ userId: store.user.id });
      setState({
        ...state,
        loading: false,
        user: data.user,
      });
      console.log(data);
    } catch (err) {
      setState({ ...state, loading: false });
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
    await patchUser({
      userId: store.user.id,
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
    await patchEmail({
      userId: store.user.id,
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
    await patchPreferences({
      userId: store.user.id,
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
    await patchPassword({
      userId: store.user.id,
      data: values,
    });
    actions.resetForm();
  };

  const handleDeactivateUser = async () => {
    await deleteUser({ userId: store.user.id });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Container fixed className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        {state.loading ? (
          <LoadingSpinner />
        ) : state.user._id ? (
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
