import { Hidden as MaterialHidden } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";

const StyledHidden = withStyles({})(MaterialHidden);

const Hidden = forwardRef((props, ref) => {
  return <StyledHidden ref={ref} {...props} />;
});

export default Hidden;
