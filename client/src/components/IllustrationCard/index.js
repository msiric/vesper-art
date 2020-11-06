import { Box, Card } from "@material-ui/core";
import React from "react";
import { Typography } from "../../styles/theme.js";
import illustrationCardStyles from "./styles.js";

const IllustrationCard = ({ heading, paragraph, illustration }) => {
  const classes = illustrationCardStyles();

  return (
    <Card className={classes.illustrationContainer}>
      <Typography fontWeight="bold" ml={2}>
        {heading}
      </Typography>
      <Typography ml={2}>{paragraph}</Typography>
      <Box className={classes.illustrationWrapper}>{illustration}</Box>
    </Card>
  );
};

export default IllustrationCard;
