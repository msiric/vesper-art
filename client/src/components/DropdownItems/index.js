import { MenuItem, TextField } from "@material-ui/core";
import React from "react";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import dropdownItemsStyles from "./styles.js";

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
    <SkeletonWrapper loading={loading}>
      <TextField
        variant={variant}
        margin={margin}
        value={value}
        label={label}
        select
        {...props}
      >
        {items.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.text}
          </MenuItem>
        ))}
      </TextField>
    </SkeletonWrapper>
  );
};

export default DropdownItems;
