import React, { useContext } from 'react';
import { Context } from '../Store/Store';
import Masonry from 'react-mason';
import {
  Paper,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
} from '@material-ui/core';
import {
  FavoriteBorderRounded as SaveIcon,
  FavoriteRounded as SavedIcon,
  ShareRounded as ShareIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import GalleryStyles from './Gallery.style';

const Gallery = ({ elements }) => {
  const [store, dispatch] = useContext(Context);
  const classes = GalleryStyles();

  const artwork = elements.map((element, index) => {
    return (
      <Card key={index} className={classes.root}>
        <CardHeader
          title={element.owner.name}
          subheader={
            element.current.available
              ? element.current.price
                ? `$${element.current.price}`
                : 'Free'
              : 'Showcase'
          }
        />
        <CardMedia
          component={Link}
          to={`/artwork/${element._id}`}
          className={classes.media}
          image={element.current.cover}
          title={element.current.title}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {element.current.title}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {store.user.saved[element._id] ? (
            <IconButton aria-label="Save artwork">
              <SavedIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="Save artwork">
              <SaveIcon />
            </IconButton>
          )}
          <IconButton aria-label="Share artwork">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  });

  return (
    <Paper className={classes.paper}>
      <Masonry>{artwork}</Masonry>
    </Paper>
  );
};

export default Gallery;
