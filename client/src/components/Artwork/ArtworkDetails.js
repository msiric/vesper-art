import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import {
  Container,
  Grid,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Paper,
  Button,
  Link as Anchor,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import ax from '../../axios.config';
import ArtworkDetailsStyles from './ArtworkDetails.style';

const ArtworkDetails = ({ match }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    artwork: {},
  });

  const classes = ArtworkDetailsStyles();

  const fetchArtwork = async () => {
    try {
      const { data } = await ax.get(`/api/artwork/${match.params.id}`);
      setState({ ...state, loading: false, artwork: data.artwork });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  return (
    <Container fixed>
      {state.loading ? (
        <CircularProgress />
      ) : (
        <Grid container className={classes.container} spacing={2}>
          <Grid item xs={12} sm={7} className={classes.grid}>
            <Paper className={classes.paper}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.cover}
                  image={state.artwork.current.cover}
                  title="Contemplative Reptile"
                />
              </Card>
            </Paper>
            <br />
            <Paper className={classes.paper}>
              <Card className={classes.root}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Comments
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {state.artwork.owner.description ||
                      "This artist doesn't have much to say about themself"}
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={5} className={classes.grid}>
            <Paper className={classes.paper}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.avatar}
                  image={state.artwork.owner.photo}
                  title={state.artwork.owner.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    <Anchor
                      component={Link}
                      to={`/user/${state.artwork.owner.name}`}
                    >
                      {state.artwork.owner.name}
                    </Anchor>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {state.artwork.owner.description ||
                      "This artist doesn't have much to say about themself"}
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
            <br />
            <Paper className={classes.paper}>
              <Card className={classes.root}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {state.artwork.current.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {state.artwork.current.description}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="h2">
                    {state.artwork.current.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {state.artwork.owner.description ||
                      "This artist doesn't have much to say about themself"}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/cart`}
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ArtworkDetails;
