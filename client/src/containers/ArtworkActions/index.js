import { FavoriteRounded as FavoritedIcon } from "@material-ui/icons";
import React from "react";
import FavoriteButton from "../../components/FavoriteButton/index";
import IncrementCounter from "../../components/IncrementCounter";
import ShareButton from "../../components/ShareButton/index";
import { useUserStore } from "../../contexts/global/user";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import Divider from "../../domain/Divider";
import { CardContent } from "../../styles/theme";
import artworkActionsStyles from "./styles";

const ArtworkActions = () => {
  const artwork = useArtworkDetails((state) => state.artwork.data);
  const favorites = useArtworkDetails((state) => state.artwork.data.favorites);
  const loading = useArtworkDetails((state) => state.artwork.loading);
  const toggleFavorite = useArtworkDetails((state) => state.toggleFavorite);

  const userId = useUserStore((state) => state.id);
  const userFavorites = useUserStore((state) => state.favorites);

  const classes = artworkActionsStyles();

  return (
    <Card className={classes.container}>
      <CardContent className={classes.content}>
        <Box className={classes.counter}>
          <Box loading={loading} customRadius className={classes.incrementer}>
            <IncrementCounter newValue={favorites} />
            <FavoritedIcon fontSize="large" className={classes.icon} />
          </Box>
        </Box>
      </CardContent>
      <Divider />
      <CardActions className={classes.footer}>
        <Box className={classes.actions}>
          {artwork.owner && artwork.owner.id !== userId && (
            <FavoriteButton
              artwork={artwork}
              favorited={userFavorites[artwork.id]}
              labeled
              handleCallback={toggleFavorite}
              loading={loading}
            />
          )}
          <ShareButton
            link={`/artwork/${artwork.id}`}
            type="artwork"
            labeled
            loading={loading}
          />
        </Box>
      </CardActions>
    </Card>
  );
};

export default ArtworkActions;
