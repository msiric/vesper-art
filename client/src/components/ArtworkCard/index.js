import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import { EditRounded as EditIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useUserStore } from "../../contexts/global/user.js";
import FavoriteButton from "../FavoriteButton/index.js";
import ImageWrapper from "../ImageWrapper/index.js";
import ShareButton from "../ShareButton/index.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
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
  const [state, setState] = useState({ favorited: false });

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
    <Card className={classes.artworkCard}>
      <CardHeader
        title={
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography
              noWrap
              variant="h6"
              component={RouterLink}
              to={`/artwork/${item.id}`}
              className={classes.artworkTitle}
            >
              {item.data.title}
            </Typography>
          </SkeletonWrapper>
        }
        subheader={
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography
              noWrap
              variant="body1"
              component={RouterLink}
              to={`/user/${item.owner.name}`}
              className={classes.artworkSeller}
            >
              {item.owner.name}
            </Typography>
          </SkeletonWrapper>
        }
        disableTypography
        className={classes.artworkHeader}
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
        placeholder={item.data.dominant}
        loading={loading}
      />
      <CardActions disableSpacing className={classes.artworkFooter}>
        <SkeletonWrapper loading={loading}>
          <Box style={{ display: "flex" }}>
            {item.owner.id === userId ? (
              <IconButton
                aria-label={"Edit artwork"}
                component={RouterLink}
                to={`/artwork/${artwork.id}/edit`}
                className={classes.buttonColor}
              >
                <EditIcon />
              </IconButton>
            ) : (
              [
                <FavoriteButton
                  artwork={item}
                  favorited={userFavorites[item.id]}
                  handleCallback={handleArtworkSave}
                />,
                <ShareButton link={`artwork/${artwork.id}`} type="artwork" />,
              ]
            )}
          </Box>
          <Box>
            <IconButton
              aria-label="Artwork price"
              className={classes.artworkColor}
            >
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
                          item.data.personal
                            ? `$${item.data.personal}`
                            : " Free"
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
        </SkeletonWrapper>
      </CardActions>
    </Card>
  );
};

export default ArtworkCard;
