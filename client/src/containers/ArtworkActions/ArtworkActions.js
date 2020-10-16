import { Box, Card, CardActions, Divider, Typography } from "@material-ui/core";
import { FavoriteRounded as FavoritedIcon } from "@material-ui/icons";
import React, { useContext } from "react";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton.js";
import ShareButton from "../../components/ShareButton/ShareButton.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";
import { Context } from "../../contexts/Store.js";
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
        <SkeletonWrapper loading={loading} width="100%">
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FavoritedIcon
                fontSize="large"
                style={{
                  marginRight: "3px",
                }}
              />
              <Typography style={{ fontSize: 34 }} align="center">
                {artwork.saves}
              </Typography>
            </Box>
          </Box>
        </SkeletonWrapper>
      </CardContent>
      <Divider />
      <CardActions style={{ padding: "14px 0" }}>
        <SkeletonWrapper loading={loading} width="100%">
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {artwork.owner && artwork.owner._id !== store.user.id && (
              <FavoriteButton
                artwork={artwork}
                favorited={store.user.saved[artwork._id]}
                labeled
                handleCallback={handleArtworkSave}
              />
            )}
            <ShareButton artwork={artwork} labeled />
          </Box>
        </SkeletonWrapper>
      </CardActions>
    </Card>
  );
};

export default ArtworkActions;
