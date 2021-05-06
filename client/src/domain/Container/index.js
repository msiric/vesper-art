import { Container as MaterialContainer } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const StyledContainer = withStyles({})(MaterialContainer);

const Container = (props) => {
  return <StyledContainer {...props}></StyledContainer>;
};

export default Container;
