import { CardHeader as MaterialCardHeader } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const StyledCardHeader = withStyles({})(MaterialCardHeader);

const CardHeader = (props) => {
  return <StyledCardHeader {...props}></StyledCardHeader>;
};

export default CardHeader;
