import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Link,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { formatDate } from '../../../../common/helpers.js';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((muiTheme) => ({}));

const ArtistSection = ({ artwork }) => {
  const classes = useStyles();

  return (
    <Grid item sm={12} md={5} className={classes.artistSectionItem}>
      <Card className={classes.artistSectionCard}>
        <CardMedia
          component="img"
          alt={artwork.owner.name}
          image={artwork.owner.photo}
          title={artwork.owner.name}
          className={classes.artistSectionMedia}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" align="center">
            {artwork.owner.name}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            align="center"
          >
            {artwork.owner.description || 'No description specified'}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            align="center"
          >
            {artwork.owner.country || 'No country specified'}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            align="center"
          >
            {`Joined ${formatDate(
              new Date(artwork.owner.created),
              'MMM yyyy'
            )}`}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default withRouter(ArtistSection);
