import { Box, Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as FourOhFour } from "../../assets/images/illustrations/not_found.svg";
import globalStyles from "../../styles/global.js";

const NotFound = () => {
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Box>
            <Typography fontWeight="bold" ml={2} fontSize={24}>
              Page not found
            </Typography>
          </Box>
          <FourOhFour />
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFound;
