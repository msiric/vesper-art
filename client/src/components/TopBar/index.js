import React from "react";
import ProgressBar from "react-topbar-progress-indicator";
import { artepunktTheme } from "../../styles/theme";
import topBarStyles from "./styles";

ProgressBar.config({
  barColors: {
    0: artepunktTheme.palette.primary.main,
    "1.0": artepunktTheme.palette.primary.main,
  },
  shadowBlur: 5,
});

const TopBar = () => {
  const classes = topBarStyles();

  return <ProgressBar />;
};

export default TopBar;
