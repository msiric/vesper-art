import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const ArtworkCard = ({ artwork }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        title={
          <Typography component={Link} to={`/artwork/${artwork._id}`}>
            {artwork.current.title}
          </Typography>
        }
        subheader={
          <Typography component={Link} to={`/user/${artwork.owner.name}`}>
            {artwork.owner.name}
          </Typography>
        }
      />
      <CardMedia
        component={Link}
        to={`/artwork/${artwork._id}`}
        className={classes.media}
        image={artwork.current.cover}
        title={artwork.title}
      />
      <CardActions disableSpacing>
        <IconButton aria-label="Save artwork">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="Share artwork">
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="Artwork price">
          <Typography>{artwork.current.price}</Typography>
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ArtworkCard;
