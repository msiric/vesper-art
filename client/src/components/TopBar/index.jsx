import React from "react";
import ProgressBar from "react-topbar-progress-indicator";
import { artepunktTheme } from "../../styles/theme";

ProgressBar.config({
  barColors: {
    0: artepunktTheme.palette.primary.main,
    "1.0": artepunktTheme.palette.primary.main,
  },
  shadowBlur: 5,
});

const TopBar = () => {
  return <ProgressBar />;
};

export default TopBar;
