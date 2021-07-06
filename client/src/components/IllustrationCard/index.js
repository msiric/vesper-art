import React from "react";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import Typography from "../../domain/Typography";
import illustrationCardStyles from "./styles";

const IllustrationCard = ({
  heading,
  paragraph,
  body,
  illustration,
  ...props
}) => {
  const classes = illustrationCardStyles();

  return (
    <Box className={classes.container} {...props}>
      <Box className={classes.wrapper}>
        <Typography className={classes.heading}>{heading}</Typography>
        <Typography className={classes.paragraph}>{paragraph}</Typography>
        {body ? body : null}
      </Box>
      <Card className={classes.label}>{illustration}</Card>
    </Box>
  );
};

export default IllustrationCard;
