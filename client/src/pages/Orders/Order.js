import { Container, Grid } from "@material-ui/core";
import React, { useRef } from "react";
import OrderCard from "../../components/OrderCard/index.js";
import ProfileCard from "../../components/ProfileCard/index.js";
import RatingWrapper from "../../components/RatingWrapper/index.js";
import LicenseCard from "../../containers/LicenseCard/index.js";
import OrderPreview from "../../containers/OrderPreview/index.js";
import ReviewCard from "../../containers/ReviewCard/index.js";
import globalStyles from "../../styles/global.js";

const Order = ({ match }) => {
  const globalClasses = globalStyles();

  const paramId = match.params.id;
  const highlightRef = useRef(null);

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <OrderPreview paramId={paramId} />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <ProfileCard />
          <br />
          <ReviewCard paramId={paramId} highlightRef={highlightRef} />
        </Grid>
        <Grid item xs={12}>
          <OrderCard />
          <br />
          <LicenseCard />
        </Grid>
      </Grid>
      <RatingWrapper paramId={paramId} />
    </Container>
  );
};

export default Order;
