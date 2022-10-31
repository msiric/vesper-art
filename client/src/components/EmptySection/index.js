import { HourglassEmptyRounded as EmptyIcon } from "@material-ui/icons";
import React from "react";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Typography from "../../domain/Typography";
import emptySectionStyles from "./styles";

const EmptySection = ({ label = "", height, loading }) => {
  const classes = emptySectionStyles({ height });

  return (
    <Container className={classes.container}>
      <Box className={classes.wrapper} loading={loading}>
        <EmptyIcon className={classes.icon} />
        <Typography variant="body2" className={classes.label}>
          {label}
        </Typography>
      </Box>
    </Container>
  );
};

export default EmptySection;
