import { Box, Card, CardActions, Divider } from "@material-ui/core";
import { FavoriteRounded as FavoritedIcon } from "@material-ui/icons";
import React from "react";
import shallow from "zustand/shallow";
import FavoriteButton from "../../components/FavoriteButton/index.js";
import IncrementCounter from "../../components/IncrementCounter";
import ShareButton from "../../components/ShareButton/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useTracked as useUserContext } from "../../contexts/global/User.js";
import { useArtworkStore } from "../../contexts/local/Artwork";
import { useFavoritesStore } from "../../contexts/local/favorites.js";
import { CardContent } from "../../styles/theme.js";
import artworkActionsStyles from "./styles.js";

const ArtworkActions = () => {
  const { artwork } = useArtworkStore(
    (state) => ({
      artwork: state.artwork.data,
    }),
    shallow
  );
  const { favorites, loading, toggleFavorite } = useFavoritesStore(
    (state) => ({
      favorites: state.favorites.data,
      loading: state.favorites.loading,
      toggleFavorite: state.toggleFavorite,
    }),
    shallow
  );
  const [userStore] = useUserContext();
  const classes = artworkActionsStyles();

  console.log("ACTIONS RENDER");

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
              <IncrementCounter newValue={favorites}></IncrementCounter>
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
            {artwork.owner && artwork.owner.id !== userStore.id && (
              <FavoriteButton
                artwork={artwork}
                favorited={userStore.favorites[artwork.id]}
                labeled
                handleCallback={toggleFavorite}
              />
            )}
            <ShareButton link="" type="artwork" labeled />
          </Box>
        </SkeletonWrapper>
      </CardActions>
    </Card>
  );
};

export default ArtworkActions;
