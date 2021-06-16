import React from "react";
import Typography from "../../domain/Typography";
import subHeadingStyles from "./styles";

const SubHeading = ({ text, loading, ...rest }) => {
  const classes = subHeadingStyles();

  return (
    <Typography loading={loading} variant="h6" {...rest}>
      {text}
    </Typography>
  );
};

export default SubHeading;
