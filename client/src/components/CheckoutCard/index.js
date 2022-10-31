import React from "react";
import Box from "../../domain/Box";
import CardHeader from "../../domain/CardHeader";
import CardMedia from "../../domain/CardMedia";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import checkoutCardStyles from "./styles";

const CheckoutCard = ({ version, loading }) => {
  const classes = checkoutCardStyles({
    height: loading ? 80 : version.cover.height / 6,
    width: loading ? 80 : version.cover.width / 6,
  });

  return (
    <Grid container className={classes.container}>
      <Box className={classes.wrapper}>
        <CardMedia
          className={classes.media}
          image={version.cover.source}
          title={version.title}
          loading={loading}
        />
      </Box>
      <Box className={classes.wrapper}>
        <CardHeader
          title={
            <Typography loading={loading}>
              {version.title || "Fetching artwork title info"}
            </Typography>
          }
          subheader={
            <Typography loading={loading}>
              {version.artwork.owner.name || "Artist name"}
            </Typography>
          }
          className={classes.text}
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
