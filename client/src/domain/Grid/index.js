import { Grid as MaterialGrid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { forwardRef } from "react";

const StyledGrid = withStyles({})(MaterialGrid);

const Grid = forwardRef((props, ref) => {
  return <StyledGrid ref={ref} {...props} />;
});

export default Grid;
