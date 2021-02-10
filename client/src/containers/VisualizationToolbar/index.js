import { Box, Typography } from "@material-ui/core";
import React from "react";
import { useUserStats } from "../../contexts/local/userStats";
import RangeInput from "../../controls/RangeInput/index.js";

const VisualizationToolbar = () => {
  const range = useUserStats((state) => state.range);
  const changeRange = useUserStats((state) => state.changeRange);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography style={{ textTransform: "capitalize" }} variant="h6">
        Visualization
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
