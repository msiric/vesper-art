import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import { useUserOrders } from "../../contexts/local/userOrders";
import globalStyles from "../../styles/global";

const OrderToolbar = () => {
  const display = useUserOrders((state) => state.display);
  const changeSelection = useUserOrders((state) => state.changeSelection);

  const globalClasses = globalStyles();

  return (
    <FormControl
      variant="outlined"
      style={{ marginBottom: "12px" }}
      className={globalClasses.dropdownOption}
    >
      <InputLabel id="data-display">Display</InputLabel>
      <Select
        labelId="data-display"
        value={display}
        onChange={(e) => changeSelection({ selection: e.target.value })}
        label="Display"
        margin="dense"
      >
        <MenuItem value="purchases">Purchases</MenuItem>
        <MenuItem value="sales">Sales</MenuItem>
      </Select>
    </FormControl>
  );
};

export default OrderToolbar;
