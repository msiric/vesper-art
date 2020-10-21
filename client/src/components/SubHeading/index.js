import { Typography } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { compose, spacing, typography } from "@material-ui/system";
import React from "react";
import subHeadingStyles from "./styles";

const Heading = styled(Typography)(compose(typography, spacing));

const SubHeading = ({ text, top }) => {
  const classes = subHeadingStyles();

  return (
    <Heading mb={2} mt={top} variant="subtitle2">
      {text}
    </Heading>
  );
};

export default SubHeading;
