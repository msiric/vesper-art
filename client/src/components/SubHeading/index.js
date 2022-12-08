import React from "react";
import Typography from "../../domain/Typography";

const SubHeading = ({ text, loading, ...rest }) => {
  return (
    <Typography loading={loading} variant="h6" {...rest}>
      {text}
    </Typography>
  );
};

export default SubHeading;
