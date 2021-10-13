import {
  ArrowBackRounded as BackIcon,
  PhotoLibraryOutlined as OrdersIcon,
  SentimentVeryDissatisfied as ErrorIcon,
  SentimentVerySatisfied as SuccessIcon,
} from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import SyncButton from "../SyncButton/index";
import checkoutStatusStyles from "./styles";

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
    <Grid container className={classes.container}>
      {success ? (
        <SuccessIcon color="primary" className={classes.sentiment} />
      ) : (
        <ErrorIcon color="error" className={classes.sentiment} />
      )}
      <Typography variant="h5" className={classes.message}>
        {message}
      </Typography>
      <SyncButton
        color="primary"
        onClick={success ? handleSuccessRedirect : handleErrorRedirect}
        startIcon={success ? <OrdersIcon /> : <BackIcon />}
      >
        {success ? "View orders" : "Go back"}
      </SyncButton>
    </Grid>
  );
};

export default CheckoutStatus;
