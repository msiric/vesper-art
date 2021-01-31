import { Box, Card, CardActions, Divider } from "@material-ui/core";
import { FavoriteRounded as FavoritedIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import FavoriteButton from "../../components/FavoriteButton/index.js";
import IncrementCounter from "../../components/IncrementCounter";
import ShareButton from "../../components/ShareButton/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useTracked as useUserContext } from "../../contexts/global/User.js";
import { useArtworkStore } from "../../contexts/local/artwork";
import { useFavoritesStore } from "../../contexts/local/favorites.js";
import { CardContent } from "../../styles/theme.js";
import artworkActionsStyles from "./styles.js";

const ArtworkActions = ({ paramId }) => {
  const artwork = useArtworkStore((state) => state.artwork.data);

  const favorites = useFavoritesStore((state) => state.favorites.data);
  const loading = useFavoritesStore((state) => state.favorites.loading);
  const fetchFavorites = useFavoritesStore((state) => state.fetchFavorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const [userStore] = useUserContext();
  const classes = artworkActionsStyles();

  useEffect(() => {
    fetchFavorites({ artworkId: paramId });
  }, []);

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
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
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
              <FavoritedIcon
                fontSize="large"
                style={{
                  marginRight: "3px",
                }}
              />
              <IncrementCounter newValue={favorites}></IncrementCounter>
            </Box>
          </SkeletonWrapper>
        </Box>
      </CardContent>
      <Divider />
      <CardActions style={{ padding: "14px" }}>
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
            <SkeletonWrapper loading={loading} width="100%">
              <ShareButton link="" type="artwork" labeled />
            </SkeletonWrapper>
          </Box>
        </SkeletonWrapper>
      </CardActions>
    </Card>
  );
};

export default ArtworkActions;
