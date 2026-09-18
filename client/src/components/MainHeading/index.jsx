import globalStyles from "@styles/global";
import React from "react";
import Typography from "../../domain/Typography/index";

const MainHeading = ({ text, loading, ...props }) => {
  const globalClasses = globalStyles();

  return (
    <Typography
      loading={loading}
      variant="h5"
      className={globalClasses.mainHeading}
      {...props}
    >
      {text}
    </Typography>
  );
};

export default MainHeading;
