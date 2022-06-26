import { Container as MaterialContainer } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";

const StyledContainer = withStyles({})(MaterialContainer);

const Container = forwardRef((props, ref) => {
  return <StyledContainer ref={ref} {...props} />;
});

export default Container;
