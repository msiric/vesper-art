import { Box, Typography } from "@material-ui/core";
import React from "react";
import { useUserStats } from "../../contexts/local/userStats";
import RangeInput from "../../controls/RangeInput/index.js";
import visualizationToolbarStyles from "./styles.js";

const VisualizationToolbar = () => {
  const range = useUserStats((state) => state.range);
  const changeRange = useUserStats((state) => state.changeRange);

  const classes = visualizationToolbarStyles();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      className={classes.visualizationToolbarHeader}
    >
      <Typography
        style={{ textTransform: "capitalize" }}
        variant="h6"
        className={classes.visualizationToolbarHeading}
      >
        Selected stats
      </Typography>
      <RangeInput
        fromLabel="From"
        toLabel="To"
        selectedDate={range}
        handleChange={(range) => changeRange({ range })}
      />
    </Box>
  );
};

export default VisualizationToolbar;
