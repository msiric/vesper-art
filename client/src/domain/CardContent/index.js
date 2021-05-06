import { CardContent as MaterialCardContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const StyledCardContent = withStyles({})(MaterialCardContent);

const CardContent = (props) => {
  return <StyledCardContent {...props}></StyledCardContent>;
};

export default CardContent;
