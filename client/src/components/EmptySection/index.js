import { HourglassEmptyRounded as EmptyIcon } from "@material-ui/icons";
import React from "react";
import Box from "../../domain/Box";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import emptySectionStyles from "./styles";

const EmptySection = ({ label, page, loading }) => {
  const classes = emptySectionStyles();

  const content = (
    <Box className={classes.wrapper} loading={loading}>
      <EmptyIcon className={classes.icon} />
      <Typography variant="body2" className={classes.label}>
        {label}
      </Typography>
    </Box>
  );

  return page ? (
    <Grid item sm={12} className={classes.container}>
      {content}
    </Grid>
  ) : (
    content
  );
};

export default EmptySection;
