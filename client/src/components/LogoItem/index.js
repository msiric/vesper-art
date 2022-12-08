import React from "react";
import { Link as RouterLink } from "react-router-dom";
import LogoDesktop from "../../../../common/assets/logo.svg";
import logoItemStyles from "./styles";

const LogoItem = ({ style }) => {
  const classes = logoItemStyles();

  return (
    <RouterLink to="/">
      <img
        src={LogoDesktop}
        alt="Logo"
        className={`${classes.logo} ${style}`}
      />
    </RouterLink>
  );
};

export default LogoItem;
