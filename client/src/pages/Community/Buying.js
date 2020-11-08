import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { app, payment } from "../../../../common/constants.js";
import MainHeading from "../../components/MainHeading";
import globalStyles from "../../styles/global.js";

const Buying = () => {
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <MainHeading text={`Buying on ${app.name}`} />
          <Typography>Signing Up</Typography>
          <Typography>
            {`Signing up is free and required for users to start downloading and purchasing
            art on ${app.name}. When you sign up, you will be able to download, 
            purchase and upload your own artwork. 
            Your art can be published as preview only (users can only view without 
            downloading or purchasing), commercially available or free to download.
            Additionally, you have complete control over the art you are publishing, 
            including the types of licenses you want to include and how much 
            to charge for each type.
            In order to monetize your art, you will have to go through the 
            onboarding process where you will be taken to Stripe to finalize 
            your account setup and receive future payments.
            Whenever an order is placed, commercial or free, the buyer will receive
            a license for using your artwork in compliance with the license's permissions
            along with the actual artwork.
            Every license that was ever generated can be verified using the platform's 
            verifer system to ensure that your art is never stolen or used in a way that 
            is outside the scope of what the license permits.
            This way, both you and the licensee are protected.
            When a commercial order is placed, you as a seller will receive 
            ${(1 - payment.appFee) * 100}% of the total order value.
            For example, if you price your artwork at $100 for personal or commercial usage, 
            you will receive $${
              (1 - payment.appFee) * 100
            } once your artwork has been purchased. 
            For more information, see the Terms of Service.`}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Buying;
