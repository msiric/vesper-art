import React from "react";
import MenuItem from "../../domain/MenuItem";
import TextField from "../../domain/TextField";
import dropdownItemsStyles from "./styles";

const DropdownItems = ({
  label,
  loading,
  value,
  items,
  variant = "outlined",
  margin = "dense",
  children,
  ...props
}) => {
  const classes = dropdownItemsStyles();

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
