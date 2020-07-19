import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { upload } from '../../../../common/constants.js';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
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
  media: {
    height: 0,
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
  artworkContainer: {
    margin: 12,
    position: 'relative',
    '&:hover': {
      '& $artworkHeader': {
        height: 60,
      },
      '& $artworkFooter': {
        height: 60,
      },
    },
  },
  artworkHeader: {
    '& div': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: 12,
    },
    width: '100%',
    height: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    transition: 'height 0.5s',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    overflow: 'hidden',
  },
  artworkFooter: {
    '& button': {
      color: 'white',
    },
    width: '100%',
    height: 0,
    padding: 0,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    transition: 'height 0.5s',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  artworkTitle: {
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  artworkSeller: {
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const ArtworkCard = ({ artwork }) => {
  const classes = useStyles();

  return (
    <Card className={classes.artworkContainer}>
      <CardHeader
        title={
          <Typography
            noWrap
            variant="h5"
            component={Link}
            to={`/artwork/${artwork._id}`}
            className={classes.artworkTitle}
          >
            {artwork.current.title}
          </Typography>
        }
        subheader={
          <Typography
            noWrap
            variant="body1"
            component={Link}
            to={`/user/${artwork.owner.name}`}
            className={classes.artworkSeller}
          >
            {artwork.owner.name}
          </Typography>
        }
        className={classes.artworkHeader}
      />
      <CardMedia
        component={Link}
        to={`/artwork/${artwork._id}`}
        className={classes.media}
        style={{
          paddingTop:
            artwork.current.height /
            (artwork.current.width / upload.artwork.fileTransform.width),
          maxWidth: upload.artwork.fileTransform.width,
        }}
        image={artwork.current.cover}
        title={artwork.title}
      />
      <CardActions disableSpacing className={classes.artworkFooter}>
        <Box>
          <IconButton
            aria-label="Save artwork"
            className={classes.artworkColor}
          >
            <FavoriteIcon />
          </IconButton>
          <IconButton
            aria-label="Share artwork"
            className={classes.artworkColor}
          >
            <ShareIcon />
          </IconButton>
        </Box>
        <Box>
          <IconButton
            aria-label="Artwork price"
            className={classes.artworkColor}
          >
            <Typography noWrap>
              {artwork.current.availability === 'unavailable'
                ? `${
                    artwork.current.personal
                      ? `$${artwork.current.personal}`
                      : ' Free'
                  }
                  /
                    ${
                      artwork.current.commercial
                        ? `$${artwork.current.commercial}`
                        : artwork.current.personal
                        ? artwork.current.personal
                        : ' Free'
                    }`
                : 'Preview only'}
            </Typography>
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ArtworkCard;
