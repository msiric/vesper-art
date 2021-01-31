import { Box, Typography } from "@material-ui/core";
import React from "react";
import { CardHeader, CardMedia, Grid } from "../../styles/theme.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import checkoutCardStyles from "./styles.js";

const CheckoutCard = ({ version, loading }) => {
  const classes = checkoutCardStyles();

  console.log("VERSION", version);

  return (
    <Grid container p={0} my={2}>
      <Grid
        item
        xs={12}
        md={version.cover.orientation === "portrait" ? 2 : 5}
        style={{ display: "flex" }}
      >
        <Box display="flex" py={0}>
          <SkeletonWrapper loading={loading} height="100px" width="100%">
            <CardMedia
              className={classes.media}
              image={version.cover.source}
              title={version.title}
            />
          </SkeletonWrapper>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        md={version.cover.orientation === "portrait" ? 10 : 7}
        className={classes.actions}
      >
        <Box display="flex" flexDirection="column">
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
            px={2}
            py={0}
            md={{ px: 0 }}
          />
          {/*           <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {version.description}
            </Typography>
          </CardContent> */}
        </Box>
      </Grid>
    </Grid>
  );
};

export default CheckoutCard;
