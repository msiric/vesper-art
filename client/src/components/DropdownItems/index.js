import React from "react";
import MenuItem from "../../domain/MenuItem";
import TextField from "../../domain/TextField";

const DropdownItems = ({
  label,
  loading,
  value,
  items,
  variant = "outlined",
  margin = "dense",
  ...props
}) => {
  return (
    <TextField
      variant={variant}
      margin={margin}
      value={value}
      label={label}
      select
      loading={loading}
      {...props}
    >
      {items.map((item, index) => (
        <MenuItem key={index} value={item.value}>
          {item.text}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default DropdownItems;
