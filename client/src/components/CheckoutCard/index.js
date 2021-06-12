import { Box, Typography } from "@material-ui/core";
import React from "react";
import { CardHeader, CardMedia, Grid } from "../../styles/theme.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import checkoutCardStyles from "./styles.js";

const CheckoutCard = ({ version, loading }) => {
  const classes = checkoutCardStyles();

  return (
    <Grid container className={classes.checkoutCardContainer}>
      <SkeletonWrapper loading={loading} height="100px" width="100%">
        <CardMedia
          className={classes.checkoutCardMedia}
          image={version.cover.source}
          title={version.title}
          style={{
            height: version.cover.height / 6,
            width: version.cover.width / 6,
          }}
        />
      </SkeletonWrapper>
      <Box className={classes.checkoutCardInfo}>
        <CardHeader
          title={
            <SkeletonWrapper variant="text" loading={loading}>
              <Typography>{version.title || "Artwork title"}</Typography>
            </SkeletonWrapper>
          }
          subheader={
            <SkeletonWrapper variant="text" loading={loading}>
              <Typography>
                {version.artwork.owner.name || "Artist name"}
              </Typography>
            </SkeletonWrapper>
          }
          className={classes.checkoutCardText}
        />
        {/*           <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {version.description}
            </Typography>
          </CardContent> */}
      </Box>
    </Grid>
  );
};

export default CheckoutCard;
