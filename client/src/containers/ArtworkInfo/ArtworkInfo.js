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
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2" align="center">
            {artwork.current.title}
          </Typography>
          <Typography
            className={classes.pos}
            color="textSecondary"
            align="center"
          >
            {artwork.current.description}
          </Typography>
          {artwork.current.availability === 'available' ? (
            <>
              <Typography variant="body2" component="p" align="center">
                Artwork price:
                {artwork.current.personal
                  ? ` $${artwork.current.personal}`
                  : ' Free'}
              </Typography>
              <Typography variant="body2" component="p" align="center">
                Commercial license:
                {artwork.current.commercial
                  ? ` $${artwork.current.commercial}`
                  : artwork.current.personal
                  ? ` $${artwork.current.personal}`
                  : ' Free'}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" component="p" align="center">
              Preview only
            </Typography>
          )}
        </CardContent>
        <CardActions>
          {artwork.owner._id !== store.user.id ? (
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
            ) : (
              <Button disabled={true}>Unavailable</Button>
            )
          ) : (
            <Button component={Link} to={`/edit_artwork/${artwork._id}`}>
              Edit artwork
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default withRouter(ArtworkInfo);
