import React, { useContext } from 'react';
import { Context } from '../../context/Store.js';
import _ from 'lodash';
import {
  Paper,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

const ArtworkInfo = ({ artwork, license, handleDownload, match }) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return (
    <Grid item sm={12} md={5} className={classes.grid}>
      <Paper className={classes.paper}>
        <Card className={classes.root}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {artwork.current.title}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {artwork.current.description}
            </Typography>
            {artwork.current.availability === 'available' ? (
              <>
                <Typography variant="body2" component="p">
                  Artwork price:
                  {artwork.current.personal
                    ? ` $${artwork.current.personal}`
                    : ' Free'}
                </Typography>
                <Typography variant="body2" component="p">
                  Commercial license:
                  {artwork.current.commercial
                    ? ` $${artwork.current.commercial}`
                    : artwork.current.personal
                    ? ` $${artwork.current.personal}`
                    : ' Free'}
                </Typography>
              </>
            ) : null}
          </CardContent>
          <CardActions>
            {artwork.owner._id !== store.user.id &&
            artwork.current.availability === 'available' ? (
              license === 'personal' ? (
                artwork.current.personal ? (
                  store.user.cart[artwork._id] ? (
                    <Button component={Link} to={'/cart/'}>
                      In cart
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      to={`/checkout/${match.params.id}`}
                    >
                      Continue
                    </Button>
                  )
                ) : (
                  <Button onClick={() => handleDownload(artwork.current._id)}>
                    Download
                  </Button>
                )
              ) : artwork.current.personal || artwork.current.commercial ? (
                <Button component={Link} to={`/checkout/${match.params.id}`}>
                  Continue
                </Button>
              ) : (
                <Button onClick={() => handleDownload(artwork.current._id)}>
                  Download
                </Button>
              )
            ) : null}
            {artwork.owner._id === store.user.id ? (
              <Button component={Link} to={`/edit_artwork/${artwork._id}`}>
                Edit artwork
              </Button>
            ) : null}
          </CardActions>
        </Card>
      </Paper>
    </Grid>
  );
};

export default withRouter(ArtworkInfo);
