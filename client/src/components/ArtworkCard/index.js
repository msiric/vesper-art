import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import { EditRounded as EditIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTracked as useUserContext } from "../../contexts/User.js";
import FavoriteButton from "../FavoriteButton/index.js";
import ImageWrapper from "../ImageWrapper/index.js";
import ShareButton from "../ShareButton/index.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import artworkCardStyles from "./styles.js";

const initialProps = {
  artwork: {
    _id: null,
    current: { cover: null, height: null, width: null },
    owner: {},
    saves: null,
  },
  type: null,
};

const ArtworkCard = ({
  artwork = initialProps.artwork,
  type = initialProps.type,
  fixed,
  handleArtworkSave,
  loading,
}) => {
  const [userStore] = useUserContext();

  const classes = artworkCardStyles();

  const item =
    type !== "version"
      ? {
          _id: artwork._id ? artwork._id : "",
          data: artwork._id ? artwork.current : {},
          owner: artwork._id ? artwork.owner : {},
          saves: artwork._id ? artwork.saves : [],
          src: artwork._id ? artwork.current.cover : "",
          height: artwork._id ? artwork.current.height : "",
          width: artwork._id ? artwork.current.width : "",
        }
      : {
          _id: artwork._id ? artwork.artwork._id : "",
          data: artwork._id ? artwork : {},
          owner: artwork._id ? artwork.artwork.owner : {},
          saves: artwork._id ? artwork.artwork.saves : [],
          src: artwork._id ? artwork.cover : "",
          height: artwork._id ? artwork.height : "",
          width: artwork._id ? artwork.width : "",
        };

  return (
    <Card className={classes.artworkCard}>
      <CardHeader
        title={
          <SkeletonWrapper variant="text" loading={loading}>
            <Typography
              noWrap
              variant="h5"
              component={RouterLink}
              to={`/artwork/${item._id}`}
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
          to={`/artwork/${item._id}`}
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
        redirect={`/artwork/${item._id}`}
        height={item.data.height}
        width={item.data.width}
        source={item.data.cover}
        placeholder={item.data.dominant}
        loading={loading}
      />
      <CardActions disableSpacing className={classes.artworkFooter}>
        <SkeletonWrapper loading={loading}>
          <Box style={{ display: "flex" }}>
            {item.owner._id === userStore.id ? (
              <IconButton
                aria-label={"Edit artwork"}
                component={RouterLink}
                to={`/artwork/${artwork._id}/edit`}
                className={classes.buttonColor}
              >
                <EditIcon />
              </IconButton>
            ) : (
              [
                <FavoriteButton
                  artwork={artwork}
                  favorited={userStore.saved[item._id]}
                  handleCallback={handleArtworkSave}
                />,
                <ShareButton link={`artwork/${artwork._id}`} type="artwork" />,
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
