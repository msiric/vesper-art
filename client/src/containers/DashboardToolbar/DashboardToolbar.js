import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { compose, typography } from "@material-ui/system";
import React from "react";
import { artepunktTheme } from "../../styles/theme.js";

const GridItem = styled(Grid)(compose(typography));

const DashboardToolbar = ({ display, handleSelectChange }) => {
  const classes = {};

  return (
    <Box display="flex" mb={artepunktTheme.margin.spacing} width="auto">
      <GridItem item xs={12} md={6}>
        <Typography style={{ textTransform: "capitalize" }} variant="h6">
          Dashboard
        </Typography>
      </GridItem>
      <GridItem item xs={12} md={6} textAlign="right">
        <FormControl
          variant="outlined"
          className={classes.formControl}
          style={{ marginBottom: "12px" }}
        >
          <InputLabel id="data-display">Display</InputLabel>
          <Select
            labelId="data-display"
            value={display.type}
            onChange={handleSelectChange}
            label="Display"
            margin="dense"
          >
            <MenuItem value="purchases">Purchases</MenuItem>
            <MenuItem value="sales">Sales</MenuItem>
          </Select>
        </FormControl>
      </GridItem>
    </Box>
  );
};

export default DashboardToolbar;
