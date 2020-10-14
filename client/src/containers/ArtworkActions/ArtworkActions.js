import { Box, Card, CardActions, Divider, Typography } from "@material-ui/core";
import { FavoriteRounded as FavoritedIcon } from "@material-ui/icons";
import React, { useContext } from "react";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton.js";
import ShareButton from "../../components/ShareButton/ShareButton.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";
import { Context } from "../../context/Store.js";
import { CardContent } from "../../styles/theme.js";

const ArtworkActions = ({ artwork = {}, handleArtworkSave, loading }) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return (
    <Card className={classes.root} loading={loading}>
      <CardContent
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography
            gutterBottom
            variant="h5"
            align="center"
            color="textPrimary"
            className={classes.profileCardName}
          >
            Artwork saves
          </Typography>
        </SkeletonWrapper>
        <SkeletonWrapper loading={loading} width="100%">
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "6px",
              }}
            >
              <FavoritedIcon
                fontSize="small"
                style={{
                  marginRight: "3px",
                }}
              />
              <Typography
                variant="body1"
                color="textSecondary"
                component="p"
                align="center"
              >
                {artwork.saves}
              </Typography>
            </Box>
          </Box>
        </SkeletonWrapper>
      </CardContent>
      {artwork.owner &&
        artwork.owner._id !== store.user.id && [
          <Divider />,
          <CardActions>
            <SkeletonWrapper loading={loading}>
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FavoriteButton
                  artwork={artwork}
                  favorited={store.user.saved[artwork._id]}
                  handleCallback={handleArtworkSave}
                />
                <ShareButton artwork={artwork} />
              </Box>
            </SkeletonWrapper>
          </CardActions>,
        ]}
    </Card>
  );
};

export default ArtworkActions;
