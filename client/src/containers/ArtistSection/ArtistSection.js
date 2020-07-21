import React from 'react';
import _ from 'lodash';
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
import { withRouter } from 'react-router-dom';

const ArtistSection = ({ artwork }) => {
  const classes = {};

  return (
    <Grid item sm={12} md={5} className={classes.grid}>
      <Card className={classes.user}>
        <CardMedia
          className={classes.avatar}
          image={artwork.owner.photo}
          title={artwork.owner.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            <Link component={RouterLink} to={`/user/${artwork.owner.name}`}>
              {artwork.owner.name}
            </Link>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {artwork.owner.description ||
              "This artist doesn't have much to say about themself"}
          </Typography>
        </CardContent>
      </Card>
      <br />
    </Grid>
  );
};

export default withRouter(ArtistSection);
