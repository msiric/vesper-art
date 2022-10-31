import React from "react";
import Background from "../../domain/Backdrop";
import CircularProgress from "../../domain/CircularProgress";
import backdropStyles from "./styles";

const Backdrop = ({ loading }) => {
  const classes = backdropStyles();

  return (
    <Background className={classes.backdrop} open={loading}>
      <CircularProgress color="primary" />
    </Background>
  );
};

export default Backdrop;
