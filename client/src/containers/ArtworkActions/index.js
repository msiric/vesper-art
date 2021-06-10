import { Divider } from "@material-ui/core";
import { FavoriteRounded as FavoritedIcon } from "@material-ui/icons";
import React from "react";
import FavoriteButton from "../../components/FavoriteButton/index.js";
import IncrementCounter from "../../components/IncrementCounter";
import ShareButton from "../../components/ShareButton/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import { CardContent } from "../../styles/theme.js";
import artworkActionsStyles from "./styles.js";

const ArtworkActions = () => {
  const artwork = useArtworkDetails((state) => state.artwork.data);
  const favorites = useArtworkDetails((state) => state.artwork.data.favorites);
  const loading = useArtworkDetails((state) => state.artwork.loading);
  const toggleFavorite = useArtworkDetails((state) => state.toggleFavorite);

  const userId = useUserStore((state) => state.id);
  const userFavorites = useUserStore((state) => state.favorites);

  const classes = artworkActionsStyles();

  return (
    <Card className={classes.artworkActionsContainer}>
      <CardContent className={classes.artworkActionsContent}>
        <Box className={classes.artworkActionsCounter}>
          <Box loading={loading} className={classes.artworkActionsIncrementer}>
            <FavoritedIcon
              fontSize="large"
              className={classes.artworkActionsFavorite}
            />
            <IncrementCounter newValue={favorites}></IncrementCounter>
          </Box>
        </Box>
      </CardContent>
      <Divider />
      <CardActions className={classes.artworkActionsFooter}>
        <Box loading={loading} className={classes.artworkActionsAction}>
          {artwork.owner && artwork.owner.id !== userId && (
            <FavoriteButton
              artwork={artwork}
              favorited={userFavorites[artwork.id]}
              labeled
              handleCallback={toggleFavorite}
            />
          )}
          <ShareButton link={`/artwork/${artwork.id}`} type="artwork" labeled />
        </Box>
      </CardActions>
    </Card>
  );
};

export default ArtworkActions;
