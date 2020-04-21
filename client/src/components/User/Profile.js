import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import SelectInput from '../../shared/SelectInput/SelectInput';
import { useFormik, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
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
} from '@material-ui/icons';
import Masonry from 'react-mason';
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
        user: data.user,
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
      <Grid container spacing={2}>
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
                      title="Avatar"
                    />
                  </Grid>
                  <Grid item>
                    <div className={classes.details}>
                      <Typography component="h3" variant="h6">
                        {state.user.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {state.user.description || 'No description available'}
                      </Typography>
                      <Grid container>
                        {/* {member.github && (
                          <IconButton
                            aria-label="github"
                            component="a"
                            href={`https://github.com/${state.user.name}`}
                            className={classes.icon}
                          >
                            <GitHubIcon fontSize="inherit" />
                          </IconButton>
                        )}
                        {member.twitter && (
                          <IconButton
                            aria-label="twitter"
                            component="a"
                            href={`https://twitter.com/${state.user.name}`}
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
                  <Masonry>{state.user.artwork}</Masonry>
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
