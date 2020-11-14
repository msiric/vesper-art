import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import AsyncButton from "../../components/AsyncButton/index.js";
import { EventsContext } from "../../contexts/Events.js";
import { UserContext } from "../../contexts/User.js";
import AutocompleteInput from "../../controls/AutocompleteInput/index.js";
import TextInput from "../../controls/TextInput/index.js";
import { postLogin } from "../../services/auth.js";
import { loginValidation } from "../../validation/login.js";

const BillingFormStyles = makeStyles((muiTheme) => ({
  fixed: {
    height: "100%",
  },
  container: {
    flex: 1,
    height: "100%",
  },
  artwork: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  root: {
    display: "flex",
    width: "100%",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  details: {
    display: "flex",
    width: "100%",
  },
  cover: {
    minWidth: 50,
    maxWidth: 200,
    width: "100%",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
    width: "100%",
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  rightList: {
    textAlign: "right",
  },
  manageLicenses: {
    padding: "8px 16px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
}));

const validationSchema = Yup.object().shape({
  firstname: Yup.string().trim().required("First name is required"),
  lastname: Yup.string().trim().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string().trim().required("Address is required"),
  zip: Yup.string().trim().required("Postal code is required"),
  city: Yup.string().trim().required("City is required"),
  country: Yup.string().trim().required("Country is required"),
});

const BillingForm = () => {
  const [userStore, userDispatch] = useContext(UserContext);
  const [eventsStore, eventsDispatch] = useContext(EventsContext);

  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, formState, errors, control } = useForm({
    resolver: yupResolver(loginValidation),
  });

  const history = useHistory();
  const classes = BillingFormStyles();

  const onSubmit = async (values) => {
    try {
      const { data } = await postLogin.request({ data: values });

      if (data.user) {
        userDispatch({
          type: "setUser",
          authenticated: true,
          token: data.accessToken,
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          photo: data.user.photo,
          stripeId: data.user.stripeId,
          country: data.user.country,
          saved: data.user.saved.reduce(function (object, item) {
            object[item] = true;
            return object;
          }, {}),
          intents: data.user.intents.reduce(function (object, item) {
            object[item.artworkId] = item.intentId;
            return object;
          }, {}),
        });
        eventsDispatch({
          type: "setEvents",
          messages: { items: [], count: data.user.messages },
          notifications: {
            ...eventsStore.notifications,
            items: [],
            count: data.user.notifications,
            hasMore: true,
            dataCursor: 0,
            dataCeiling: 10,
          },
        });
      }
      history.push("/");
    } catch (err) {
      console.log(err);
      enqueueSnackbar(postLogin.error.message, {
        variant: postLogin.error.variant,
      });
    }
  };

  return (
    <Box>
      <TextInput
        name="billingName"
        type="text"
        label="First name"
        errors={errors}
      />
      <TextInput
        name="billingSurname"
        type="text"
        label="Last name"
        errors={errors}
      />
      <TextInput
        name="billingEmail"
        type="text"
        label="Email address"
        errors={errors}
      />
      <TextInput
        name="billingAddress"
        type="text"
        label="Street address"
        errors={errors}
      />
      <TextInput
        name="billingZip"
        type="text"
        label="Email address"
        errors={errors}
      />
      <TextInput name="billingCity" type="text" label="City" errors={errors} />
      <AutocompleteInput
        name="billingCountry"
        type="text"
        label="Country"
        errors={errors}
      />
      <AsyncButton
        type="submit"
        fullWidth
        variant="outlined"
        color="primary"
        padding
        loading={formState.isSubmitting}
      >
        Update
      </AsyncButton>
    </Box>
  );
};

export default BillingForm;
