import AnimatedCard from "@components/AnimatedCard";
import AnimatedError from "@components/AnimatedError";
import AnimatedSuccess from "@components/AnimatedSuccess";
import Box from "@domain/Box";
import {
  ArrowBackRounded as BackIcon,
  PhotoLibraryOutlined as OrdersIcon,
} from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import SyncButton from "../SyncButton/index";
import checkoutStatusStyles from "./styles";

const CheckoutStatus = ({ success, heading, summary, message, version }) => {
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
      <Typography variant="h5" className={classes.heading}>
        {heading}
      </Typography>
      <Box className={classes.wrapper}>
        <Typography variant="body" className={classes.summary}>
          {summary}
        </Typography>
        <Box className={classes.animation}>
          <AnimatedCard />
          {success ? <AnimatedSuccess /> : <AnimatedError />}
        </Box>
        <Typography variant="body" className={classes.message}>
          {message}
        </Typography>
      </Box>
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
