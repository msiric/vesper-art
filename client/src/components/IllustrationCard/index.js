import { Box, Card } from "@material-ui/core";
import React from "react";
import { Typography } from "../../styles/theme.js";
import illustrationCardStyles from "./styles.js";

const IllustrationCard = ({
  heading,
  paragraph,
  body,
  illustration,
  ...props
}) => {
  const classes = illustrationCardStyles();

  return (
    <Box className={classes.illustrationContainer} {...props}>
      <Box className={classes.illustrationLabel}>
        <Typography fontWeight="bold" ml={2} fontSize={24}>
          {heading}
        </Typography>
        <Typography ml={2}>{paragraph}</Typography>
        {body ? body : null}
      </Box>
      <Card className={classes.illustrationWrapper}>{illustration}</Card>
    </Box>
  );
};

export default IllustrationCard;
