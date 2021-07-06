import React from "react";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const Redirect = () => {
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Box>
            <Typography fontWeight="bold" ml={2} fontSize={24}>
              Can't find requested resource
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Redirect;
