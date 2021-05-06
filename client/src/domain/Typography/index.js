import { Typography as MaterialTypography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const StyledTypography = withStyles({})(MaterialTypography);

const Typography = (props) => {
  return <StyledTypography {...props}></StyledTypography>;
};

export default Typography;
