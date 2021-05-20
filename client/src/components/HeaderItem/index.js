import {
  Avatar,
  Badge,
  IconButton,
  ListItemAvatar,
  ListItemText,
  MenuItem,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const HeaderItem = ({
  menu,
  auth,
  hidden,
  handleClick,
  ariaLabel,
  showBadge,
  badgeValue,
  icon,
  redirect,
  label,
}) => {
  return menu ? (
    !hidden && (
      <MenuItem
        component={Link}
        {...(handleClick ? { onClick: handleClick } : { to: redirect })}
        disableRipple
      >
        <ListItemAvatar>
          <Avatar>{icon}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={label} />
      </MenuItem>
    )
  ) : auth ? (
    <MenuItem onClick={handleClick}>
      <IconButton aria-label={ariaLabel} color="inherit">
        {showBadge && (
          <Badge badgeContent={badgeValue} color="primary">
            {icon}
          </Badge>
        )}
      </IconButton>
      <p>{label}</p>
    </MenuItem>
  ) : (
    <MenuItem component={Link} variant="outlined" to={redirect}>
      <p>{label}</p>
    </MenuItem>
  );
};

export default HeaderItem;
