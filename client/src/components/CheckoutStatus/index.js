import { Grid, Typography } from "@material-ui/core";
import {
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import SyncButton from "../SyncButton/index.js";
import checkoutStatusStyles from "./styles.js";

const CheckoutStatus = ({ success, message, version }) => {
  const history = useHistory();

  const classes = checkoutStatusStyles();

  const handleSuccessRedirect = () => {
    history.push("/orders");
  };

  const handleErrorRedirect = () => {
    history.push(`/artwork/${version.artwork.id}`);
  };

  return (
    <Grid
      container
      direction="column"
      justify="space-evenly"
      alignItems="center"
      style={{ height: "100%" }}
    >
      {success ? (
        <SentimentVerySatisfied color="primary" style={{ fontSize: "5rem" }} />
      ) : (
        <SentimentVeryDissatisfied color="error" style={{ fontSize: "5rem" }} />
      )}
      <Typography variant="h5" style={{ textAlign: "center" }}>
        {message}
      </Typography>
      <SyncButton
        color="primary"
        onClick={success ? handleSuccessRedirect : handleErrorRedirect}
      >
        {success ? "View orders" : "Go back"}
      </SyncButton>
    </Grid>
  );
};

export default CheckoutStatus;
