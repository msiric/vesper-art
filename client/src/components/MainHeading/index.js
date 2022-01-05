import React from "react";
import Typography from "../../domain/Typography/index";
import mainHeadingStyles from "./styles";

const MainHeading = ({ text, loading, ...props }) => {
  const classes = mainHeadingStyles();

  return (
    <Typography loading={loading} variant="h5" {...props}>
      {text}
    </Typography>
  );
};

export default MainHeading;
