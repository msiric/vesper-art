import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { CardHeader, CardMedia, Grid } from "../../styles/theme.js";
import SkeletonWrapper from "../SkeletonWrapper/SkeletonWrapper.js";

const useStyles = makeStyles((theme) => ({
  media: {
    minWidth: 50,
    width: "100%",
  },
}));

const CheckoutCard = ({ version, loading }) => {
  const classes = useStyles();

  return (
    <Grid container p={0} my={4}>
      <Grid item xs={12} md={5} style={{ display: "flex" }}>
        <Box display="flex" width="100%" py={0}>
          <SkeletonWrapper loading={loading} height="50px" width="100%">
            <CardMedia
              className={classes.media}
              image={version.cover}
              title={version.title}
            />
          </SkeletonWrapper>
        </Box>
      </Grid>
      <Grid item xs={12} md={7} className={classes.actions}>
        <Box display="flex" flexDirection="column">
          <CardHeader
            title={<SkeletonWrapper variant="text" loading={loading}><Typography>{version.title || 'Artwork title'}</Typography></SkeletonWrapper>}
            subheader={<SkeletonWrapper variant="text" loading={loading}><Typography>{version.artwork.owner.name || 'Artist name'}</Typography></SkeletonWrapper>}
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
