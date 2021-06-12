import { EditRounded as EditIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useUserStore } from "../../contexts/global/user.js";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardActions from "../../domain/CardActions";
import CardHeader from "../../domain/CardHeader";
import IconButton from "../../domain/IconButton";
import Typography from "../../domain/Typography";
import FavoriteButton from "../FavoriteButton/index.js";
import ImageWrapper from "../ImageWrapper/index.js";
import ShareButton from "../ShareButton/index.js";
import artworkCardStyles from "./styles.js";

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
  handleArtworkSave,
  loading,
}) => {
  const userId = useUserStore((state) => state.id);
  const userFavorites = useUserStore((state) => state.favorites);

  const classes = artworkCardStyles();

  const item =
    type === "version"
      ? {
          id: artwork.id ? artwork.artwork.id : "",
          data: artwork.id ? artwork : {},
          owner: artwork.id ? artwork.artwork.owner : {},
          favorites: artwork.id ? artwork.artwork.favorites : [],
          src: artwork.id ? artwork.cover.source : "",
          height: artwork.id ? artwork.cover.height : "",
          width: artwork.id ? artwork.cover.width : "",
        }
      : type === "favorite"
      ? {
          id: artwork.id ? artwork.artwork.id : "",
          data: artwork.id ? artwork.artwork.current : {},
          owner: artwork.id ? artwork.artwork.owner : {},
          favorites: artwork.id ? artwork.artwork.favorites : [],
          src: artwork.id ? artwork.artwork.current.cover.source : "",
          height: artwork.id ? artwork.artwork.current.cover.height : "",
          width: artwork.id ? artwork.artwork.current.cover.width : "",
        }
      : {
          id: artwork.id ? artwork.id : "",
          data: artwork.id ? artwork.current : {},
          owner: artwork.id ? artwork.owner : {},
          favorites: artwork.id ? artwork.favorites : [],
          src: artwork.id ? artwork.current.cover.source : "",
          height: artwork.id ? artwork.current.cover.height : "",
          width: artwork.id ? artwork.current.cover.width : "",
        };

  return (
    <Card className={classes.container}>
      <CardHeader
        title={
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
        }
        subheader={
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
        }
        disableTypography
        className={classes.header}
      />
      {/*       <SkeletonWrapper loading={loading} height="180px">
        <CardMedia
          component={RouterLink}
          to={`/artwork/${item.id}`}
          className={classes.artworkMedia}
          style={{
            paddingTop: `${(item.data.height / item.data.width) * 100}%`,
            maxWidth: upload.artwork.fileTransform.width,
            width: "100%",
          }}
          image={item.data.cover}
          title={item.title}
        />
      </SkeletonWrapper> */}
      <ImageWrapper
        redirect={`/artwork/${item.id}`}
        height={item.data.height}
        width={item.data.width}
        source={item.data.cover ? item.data.cover.source : ""}
        placeholder={
          item.data.cover ? item.data.cover.dominant : item.data.dominant
        }
        loading={loading}
      />
      <CardActions disableSpacing className={classes.footer}>
        <Box style={{ display: "flex" }} loading={loading}>
          {item.owner.id === userId ? (
            <IconButton
              aria-label={"Edit artwork"}
              component={RouterLink}
              to={`/artwork/${artwork.id}/edit`}
              className={classes.button}
            >
              <EditIcon />
            </IconButton>
          ) : (
            <FavoriteButton
              artwork={item}
              favorited={userFavorites[item.id]}
              handleCallback={handleArtworkSave}
            />
          )}
          <ShareButton link={`/artwork/${artwork.id}`} type="artwork" />
        </Box>
        <Box>
          <IconButton aria-label="Artwork price">
            <Typography noWrap>
              {item.data.availability === "available"
                ? item.data.license === "commercial"
                  ? item.data.use === "included"
                    ? `- / ${
                        item.data.commercial
                          ? `$${item.data.commercial}`
                          : " Free"
                      }`
                    : `${
                        item.data.personal ? `$${item.data.personal}` : " Free"
                      }
                    /
                      ${
                        item.data.commercial
                          ? `$${item.data.commercial}`
                          : item.data.personal
                          ? item.data.personal
                          : " Free"
                      }`
                  : `${
                      item.data.personal ? `$${item.data.personal}` : " Free"
                    } / -`
                : "Preview only"}
            </Typography>
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ArtworkCard;
