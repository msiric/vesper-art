import React from "react";
import { useHistory } from "react-router-dom";
import LogoDesktop from "../../../../common/assets/logo.svg";
import { useHomeArtwork } from "../../contexts/local/homeArtwork";
import logoItemStyles from "./styles";

const LogoItem = ({ style }) => {
  const loading = useHomeArtwork((state) => state.artwork.loading);

  const history = useHistory();

  const classes = logoItemStyles();

  const handleClick = () => {
    if (!loading) {
      history.push("/");
    }
  };

  return (
    <img
      src={LogoDesktop}
      alt="Logo"
      onClick={handleClick}
      className={`${classes.logo} ${style}`}
    />
  );
};

export default LogoItem;
