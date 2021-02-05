import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { global } from "../../../../common/constants";
import MainHeading from "../../components/MainHeading";
import globalStyles from "../../styles/global.js";

const Buying = () => {
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <MainHeading text={`Buying on ${global.appName}`} />
          <Typography>Signing Up</Typography>
          <Typography>
            {`Signing up is free and required for users to start downloading and purchasing
            art on ${global.appName}. When you sign up, you will be able to download, 
            purchase and upload your own artwork. 
            When browsing artwork, pay attention to the their type and availability.
            Artists can upload art as preview only, which allows you to only view the 
            artwork without downloading or purchasing, or available for download, which allows 
            you to download the artwork for free or purchase it, depending on the type of the artwork.
            If an artwork is published as available for download, the artist may offer
            a personal license, which allows you to $TODO include personal license permissions,
            and/or a commercial license, which allows you to $TODO include commercial license 
            permissions.
            A license may be free of charge which will allow you to download the artwork
            for free compared to a billable license, which you will have to purchase.
            In both cases, you will have to fill out the necessary license information in order to
            receive both the artwork you picked and the license along with it.
            This allows you to prove that you are the legitimate owner of the artwork and
            that you can use it as specified in the license's permissions, so make sure you
            store it somewhere safe.
            In addition to the above, you can verify your licenses using the platform's verifier
            system to ensure the authenticity and non-repudiation of your ownership.
            Every billable order you place will be subject to the ${global.appName}'s service fee, which
            will be displayed on the checkout page before you confirm your payment.
            For more information, see the Terms of Service.`}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Buying;
