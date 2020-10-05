import { Typography } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { compose, sizing, spacing, typography } from "@material-ui/system";
import React from "react";

const Heading = styled(Typography)(compose(typography, spacing, sizing));

const MainHeading = ({ text, ...rest }) => {
  return (
    <Heading variant="h6" {...rest}>
      {text}
    </Heading>
  );
};

export default MainHeading;
