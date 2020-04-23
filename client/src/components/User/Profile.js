import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import SelectInput from '../../shared/SelectInput/SelectInput';
import { useFormik, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Gallery from '../Home/Gallery';
import {
  Modal,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  ListItemSecondaryAction,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Paper,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Popover,
  Link as Anchor,
} from '@material-ui/core';
import {
  MoreVertRounded as MoreIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  FavoriteBorderRounded as SaveIcon,
  FavoriteRounded as SavedIcon,
  ShareRounded as ShareIcon,
  LinkRounded as CopyIcon,
} from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import ax from '../../axios.config';
import ProfileStyles from './Profile.style';

const Profile = ({ match }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    user: {},
  });
  const history = useHistory();

  const classes = ProfileStyles();

  const fetchUser = async () => {
    try {
      const { data } = await ax.get(`/api/user/${match.params.id}`);
      setState({
        ...state,
        loading: false,
        user: { ...data.user, artwork: data.artwork },
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.user._id ? (
          <>
            <Grid item sm={12} className={classes.grid}>
              <Paper className={classes.user} variant="outlined">
                <Grid container wrap="nowrap">
                  <Grid item>
                    <CardMedia
                      className={classes.cover}
                      image={state.user.photo}
                      title={state.user.name}
                    />
                  </Grid>
                  <Grid item>
                    <div className={classes.details}>
                      <Typography component="h3" variant="h6">
                        {state.user.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {state.user.description ||
                          'This user provided no description about themself'}
                      </Typography>
                      <Grid container>
                        {/* {state.user.github && (
                              <IconButton
                                aria-label="github"
                                component="a"
                                href={`https://github.com/${state.user.github}`}
                                className={classes.icon}
                              >
                                <GitHubIcon fontSize="inherit" />
                              </IconButton>
                            )}
                            {state.user.twitter && (
                              <IconButton
                                aria-label="twitter"
                                component="a"
                                href={`https://twitter.com/${state.user.twitter}`}
                                className={classes.icon}
                              >
                                <TwitterIcon fontSize="inherit" />
                              </IconButton>
                            )} */}
                      </Grid>
                    </div>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item sm={12} className={classes.grid}>
              <Paper className={classes.artwork} variant="outlined">
                <Typography variant="h6" align="center">
                  Artwork
                </Typography>
                {state.user.artwork.length ? (
                  <Gallery elements={state.user.artwork} />
                ) : (
                  <Typography variant="h6" align="center">
                    This user has no artwork to display
                  </Typography>
                )}
              </Paper>
            </Grid>
          </>
        ) : (
          history.push('/')
        )}
      </Grid>
    </Container>
  );
};

export default Profile;
