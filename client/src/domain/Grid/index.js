import { Grid as MaterialGrid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const StyledGrid = withStyles({})(MaterialGrid);

const Grid = (props) => {
  return <StyledGrid {...props}></StyledGrid>;
};

export default Grid;
