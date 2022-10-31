import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import LogoDesktop from "../../../../common/assets/logo.svg";
import { useHomeArtwork } from "../../contexts/local/homeArtwork";
import logoItemStyles from "./styles";

const LogoItem = ({ style }) => {
  const loading = useHomeArtwork((state) => state.artwork.loading);

  const history = useHistory();

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
