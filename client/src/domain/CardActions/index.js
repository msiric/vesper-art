import { CardActions as MaterialCardActions } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const StyledCardActions = withStyles({})(MaterialCardActions);

const CardActions = (props) => {
  return <StyledCardActions {...props}></StyledCardActions>;
};

export default CardActions;
