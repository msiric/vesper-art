import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import Modal from '../../shared/Modal/Modal';
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
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
    modal: {
      open: false,
      body: ``,
    },
  });

  const classes = ArtworkDetailsStyles();

  const modalBody = () => {
    return (
      <div className={classes.licenseContainer}>Testing license modal</div>
    );
  };

  const fetchArtwork = async () => {
    try {
      const { data } = await ax.get(`/api/artwork/${match.params.id}`);
      setState({ ...state, loading: false, artwork: data.artwork });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handleDownload = async (id) => {
    try {
      const { data } = await ax.get(`/api/artwork/${match.params.id}`);
      setState({ ...state, loading: false, artwork: data.artwork });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: true,
        body: modalBody(),
      },
    }));
  };

  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: false,
        body: ``,
      },
    }));
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <Grid item sm={12} md={7} className={classes.grid}>
              <Paper className={classes.paper}>
                <Card className={classes.root}>
                  <CardMedia
                    className={classes.cover}
                    image={state.artwork.current.cover}
                    title={state.artwork.current.title}
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
                      {state.artwork.comments.length ? (
                        <List className={classes.root}>
                          {state.artwork.comments.map((comment) => (
                            <React.Fragment key={comment._id}>
                              <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                  <Avatar
                                    alt={comment.owner.name}
                                    src={comment.owner.photo}
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography className={classes.fonts}>
                                      {comment.owner.name}
                                    </Typography>
                                  }
                                  secondary={<>{comment.content}</>}
                                />
                              </ListItem>
                              <Divider />
                            </React.Fragment>
                          ))}
                        </List>
                      ) : (
                        <p>No comments</p>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item sm={12} md={5} className={classes.grid}>
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
                    <Typography variant="h5" component="h2">
                      {state.artwork.current.title}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {state.artwork.current.description}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {state.artwork.current.availability
                        ? state.artwork.current.price
                          ? `$${state.artwork.current.price}`
                          : 'Free'
                        : 'Showcase'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {state.artwork.owner._id !== store.user.id &&
                    state.artwork.current.availability ? (
                      state.artwork.current.price ? (
                        <Button onClick={() => handleModalOpen()}>
                          Add to cart
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            handleDownload(state.artwork.current._id)
                          }
                        >
                          Download
                        </Button>
                      )
                    ) : null}
                    {state.artwork.owner._id === store.user.id ? (
                      <Button
                        component={Link}
                        to={`/edit_artwork/${state.artwork._id}`}
                      >
                        Edit artwork
                      </Button>
                    ) : null}
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          </>
        )}
        <Modal {...state.modal} handleClose={handleModalClose} />
      </Grid>
    </Container>
  );
};

export default ArtworkDetails;
