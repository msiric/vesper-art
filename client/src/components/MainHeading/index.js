import React from "react";
import Typography from "../../domain/Typography/index";
import mainHeadingStyles from "./styles";

const MainHeading = ({ text, loading, style, ...props }) => {
  const classes = mainHeadingStyles();

  return (
    <Typography loading={loading} variant="h5" style={{ ...style }} {...props}>
      {text}
    </Typography>
  );
};

export default MainHeading;
