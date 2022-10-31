import globalStyles from "@styles/global";
import React from "react";
import Typography from "../../domain/Typography/index";
import mainHeadingStyles from "./styles";

const MainHeading = ({ text, loading, ...props }) => {
  const globalClasses = globalStyles();
  const classes = mainHeadingStyles();

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
