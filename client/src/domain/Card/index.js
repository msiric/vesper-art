import { Card as MaterialCard } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const StyledCard = withStyles({})(MaterialCard);

const Card = (props) => {
  return <StyledCard {...props}></StyledCard>;
};

export default Card;
