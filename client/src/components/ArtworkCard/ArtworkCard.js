import { Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Link } from "react-router-dom";
import { upload } from "../../../../common/constants.js";
import EditButton from "../EditButton/EditButton.js";
import FavoriteButton from "../FavoriteButton/FavoriteButton.js";
import ShareButton from "../ShareButton/ShareButton.js";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  artworkContainer: {
    margin: 12,
    position: "relative",
    "&:hover": {
      "& $artworkHeader": {
        height: 60,
      },
      "& $artworkFooter": {
        height: 60,
      },
    },
  },
  artworkHeader: {
    "& div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflow: "hidden",
      padding: 12,
    },
    width: "100%",
    height: 0,
    padding: 0,
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    transition: "height 0.5s",
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    overflow: "hidden",
  },
  artworkFooter: {
    "& button": {
      color: "white",
    },
    width: "100%",
    height: 0,
    padding: 0,
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    transition: "height 0.5s",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  artworkTitle: {
    color: "white",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  artworkSeller: {
    color: "white",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const ArtworkCard = ({ user, artwork, type }) => {
  const classes = useStyles();

  const item =
    type !== "version"
      ? {
          _id: artwork._id,
          data: artwork.current,
          owner: artwork.owner,
          src: artwork.current.cover,
          height: artwork.current.height,
          width: artwork.current.width,
        }
      : {
          _id: artwork.artwork._id,
          data: artwork,
          owner: artwork.artwork.owner,
          src: artwork.cover,
          height: artwork.height,
          width: artwork.width,
        };

  return (
    <Card className={classes.artworkContainer}>
      <CardHeader
        title={
          <Typography
            noWrap
            variant="h5"
            component={Link}
            to={`/artwork/${item._id}`}
            className={classes.artworkTitle}
          >
            {item.data.title}
          </Typography>
        }
        subheader={
          <Typography
            noWrap
            variant="body1"
            component={Link}
            to={`/user/${item.owner.name}`}
            className={classes.artworkSeller}
          >
            {item.owner.name}
          </Typography>
        }
        className={classes.artworkHeader}
      />
      <CardMedia
        component={Link}
        to={`/artwork/${item._id}`}
        className={classes.media}
        style={{
          paddingTop:
            item.data.height /
            (item.data.width / upload.artwork.fileTransform.width) /
            2,
          maxWidth: upload.artwork.fileTransform.width,
        }}
        image={item.data.cover}
        title={item.title}
      />
      <CardActions disableSpacing className={classes.artworkFooter}>
        <Box>
          {item.owner._id === user.id ? (
            <EditButton artwork={artwork} />
          ) : (
            [
              <FavoriteButton
                artwork={artwork}
                favorited={user.saved[item._id]}
              />,
              <ShareButton artwork={artwork} />,
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
                  ? `${item.data.personal ? `$${item.data.personal}` : " Free"}
                  /
                    ${
                      item.data.commercial
                        ? `$${item.data.commercial}`
                        : item.data.personal
                        ? item.data.personal
                        : " Free"
                    }`
                  : `${item.data.personal ? `$${item.data.personal}` : " Free"}`
                : "Preview only"}
            </Typography>
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ArtworkCard;
