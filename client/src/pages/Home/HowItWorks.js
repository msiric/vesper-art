import { Grid, Typography } from "@material-ui/core";
import React from "react";

const HowItWorks = ({ location }) => {
  return (
    <Grid key={location.key} container>
      <Grid item xs={12}>
        <Typography>
          How Fiverr Works Fiverr is the world’s largest marketplace for digital
          services. A service offered on Fiverr is called a Gig. Sellers have
          the option to choose their starting price point. Sellers can even
          offer multiple price ranges by using Gig Packages. With Gig Packages,
          they can offer buyers different service packages at different prices.
          Signing Up Signing up for Fiverr is free. Only registered users can
          buy and sell on Fiverr. When you sign up, your account will be a buyer
          account. To become a seller, follow these instructions. Almost anyone
          can find something to sell on Fiverr. Browse our categories and look
          at how other sellers offer their services, find where your skills can
          fit in, and then decide how you want to sell. The best sellers don’t
          leave room for misunderstandings. For example: Make sure your seller
          profile is complete. Make sure your Gigs are well written and describe
          the services you provide in detail. Make sure your work samples
          accurately show your skills. If your buyers’ expectations are met or
          exceeded, you’ll get a good rating and more business. Buyers who
          purchase your Gig pay Fiverr in advance. When your order is
          successfully delivered and completed, you will receive 80% of the
          total order value. For example, if you price your service at $10, you
          will receive $8 for a completed order. For more information, see our
          Terms of Service. Tip: You can boost your income by offering your
          customers extra services during the order process. Communicate
          effectively to understand what your Buyer's needs are and how your
          skills can help them achieve their goals.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default HowItWorks;
