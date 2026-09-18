import React from "react";
import { useUserStats } from "../../contexts/local/userStats";
import RangeInput from "../../controls/RangeInput/index";
import Box from "../../domain/Box";
import Typography from "../../domain/Typography";
import visualizationToolbarStyles from "./styles";

const VisualizationToolbar = () => {
  const range = useUserStats((state) => state.range);
  const changeRange = useUserStats((state) => state.changeRange);
  const loading = useUserStats((state) => state.selectedStats.loading);

  const classes = visualizationToolbarStyles();

  return (
    <Box className={classes.container}>
      <Typography variant="h6" className={classes.heading}>
        Sampled data
      </Typography>
      <RangeInput
        fromLabel="From"
        toLabel="To"
        selectedDate={range}
        handleChange={(range) => changeRange({ range })}
        loading={loading}
      />
    </Box>
  );
};

export default VisualizationToolbar;
