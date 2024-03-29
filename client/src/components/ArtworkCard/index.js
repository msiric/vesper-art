import CommentButton from "@components/CommentButton";
import IncrementCounter from "@components/IncrementCounter";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatArtworkPrice } from "../../../../common/helpers";
import { useUserStore } from "../../contexts/global/user";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardHeader from "../../domain/CardHeader";
import Typography from "../../domain/Typography";
import FavoriteButton from "../FavoriteButton/index";
import ImageWrapper from "../ImageWrapper/index";
import ShareButton from "../ShareButton/index";
import artworkCardStyles from "./styles";

const initialProps = {
  artwork: {
    id: null,
    current: { cover: null, height: null, width: null },
    owner: {},
    favorites: null,
  },
  type: null,
};

const ArtworkCard = ({
  artwork = initialProps.artwork,
  type = initialProps.type,
  loading,
}) => {
  const [favorites, setFavorites] = useState(0);
  const userId = useUserStore((state) => state.id);
  const userFavorites = useUserStore((state) => state.favorites);

  const classes = artworkCardStyles();

  const item = loading
    ? {
        id: "",
        data: { cover: {} },
        owner: {},
        favorites: 0,
        comments: 0,
        src: "",
        height: "",
        width: "",
      }
    : type === "version"
    ? {
        id: artwork.id ? artwork.artwork.id : "",
        data: artwork.id ? artwork : {},
        owner: artwork.id ? artwork.artwork.owner : {},
        favorites: artwork.id ? artwork.artwork.favorites : 0,
        comments: artwork.id ? artwork.artwork.comments : 0,
        src: artwork.id ? artwork.cover.source : "",
        height: artwork.id ? artwork.cover.height : "",
        width: artwork.id ? artwork.cover.width : "",
      }
    : type === "favorite"
    ? {
        id: artwork.id ? artwork.artwork.id : "",
        data: artwork.id ? artwork.artwork.current : {},
        owner: artwork.id ? artwork.artwork.owner : {},
        favorites: artwork.id ? artwork.artwork.favorites : 0,
        comments: artwork.id ? artwork.artwork.comments : 0,
        src: artwork.id ? artwork.artwork.current.cover.source : "",
        height: artwork.id ? artwork.artwork.current.cover.height : "",
        width: artwork.id ? artwork.artwork.current.cover.width : "",
      }
    : {
        id: artwork.id ? artwork.id : "",
        data: artwork.id ? artwork.current : {},
        owner: artwork.id ? artwork.owner : {},
        favorites: artwork.id ? artwork.favorites : 0,
        comments: artwork.id ? artwork.comments : 0,
        src: artwork.id ? artwork.current.cover.source : "",
        height: artwork.id ? artwork.current.cover.height : "",
        width: artwork.id ? artwork.current.cover.width : "",
      };

  const handleArtworkSave = ({ incrementBy }) =>
    setFavorites((prevState) => prevState + incrementBy);

  useEffect(() => {
    setFavorites(item.favorites);
  }, [item.id, item.favorites]);

  return (
    <Card
      className={`${classes.container} ${!loading && classes.containerHover}`}
    >
      <CardHeader
        title={
          <Box className={classes.labelWrapper}>
            <Typography
              noWrap
              variant="h6"
              component={RouterLink}
              to={`/artwork/${item.id}`}
              loading={loading}
              className={classes.title}
            >
              {item.data.title}
            </Typography>
          </Box>
        }
        subheader={
          <Box className={classes.labelWrapper}>
            <Typography
              noWrap
              variant="body1"
              component={RouterLink}
              to={`/user/${item.owner.name}`}
              loading={loading}
              className={classes.owner}
            >
              {item.owner.name}
            </Typography>
          </Box>
        }
        disableTypography
        className={classes.header}
      />
      <Box className={classes.imageContainer}>
        <ImageWrapper
          redirect={`/artwork/${item.id}`}
          height={item.data.cover.height}
          source={item.data.cover ? item.data.cover.source : ""}
          placeholder={
            item.data.cover ? item.data.cover.dominant : item.data.dominant
          }
          addOverlay
          shouldCover
          loading={loading}
        />
      </Box>
      <CardActions disableSpacing className={classes.footer}>
        <Box className={classes.buttonWrapper} loading={loading}>
          <Box className={classes.favoritesWrapper} loading={loading}>
            <IncrementCounter newValue={favorites} size="small" />
            <FavoriteButton
              artwork={item}
              favorited={userFavorites[item.id] || item.owner.id === userId}
              disabled={item.owner.id === userId}
              size="small"
              handleCallback={handleArtworkSave}
              className={classes.favoriteButton}
            />
          </Box>
          <Box className={classes.commentsWrapper} loading={loading}>
            <IncrementCounter newValue={item.comments} size="small" />
            <CommentButton artworkId={artwork.id} size="small" />
          </Box>
          <ShareButton
            link={`/artwork/${artwork.id}`}
            type="artwork"
            size="small"
            fontSize="small"
          />
        </Box>
        <Box>
          <Typography noWrap className={classes.price} loading={loading}>
            {item.data.availability === "available"
              ? item.data.license === "commercial"
                ? item.data.use === "included"
                  ? `- / ${
                      item.data.commercial
                        ? formatArtworkPrice({
                            price: item.data.commercial,
                            withAbbreviation: true,
                          })
                        : " Free"
                    }`
                  : `${
                      item.data.personal
                        ? formatArtworkPrice({
                            price: item.data.personal,
                            withAbbreviation: true,
                          })
                        : " Free"
                    }
                    /
                      ${
                        item.data.commercial
                          ? formatArtworkPrice({
                              price: item.data.commercial,
                              withAbbreviation: true,
                            })
                          : item.data.personal
                          ? item.data.personal
                          : " Free"
                      }`
                : `${
                    item.data.personal
                      ? formatArtworkPrice({
                          price: item.data.personal,
                          withAbbreviation: true,
                        })
                      : " Free"
                  } / -`
              : "Preview only"}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ArtworkCard;
