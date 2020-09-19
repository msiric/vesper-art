import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  CloudDownloadRounded as DownloadIcon,
  RateReviewRounded as ReviewIcon,
} from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

const ArtworkBar = ({ version, buyer, seller }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image={version.cover}
        title={version.title}
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {version.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {seller.name}
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton aria-label="Download">
            <DownloadIcon />
          </IconButton>
          <IconButton aria-label="Rate">
            <ReviewIcon />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};

export default ArtworkBar;
