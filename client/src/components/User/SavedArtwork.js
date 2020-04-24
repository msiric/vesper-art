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
import SavedArtworkStyles from './SavedArtwork.style';

const SavedArtwork = () => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    artwork: [],
  });
  const history = useHistory();

  const classes = SavedArtworkStyles();

  const fetchUser = async () => {
    try {
      const { data } = await ax.get(`/api/user/${store.user.id}/saved_artwork`);
      setState({
        ...state,
        loading: false,
        artwork: data.savedArtwork,
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
        ) : (
          <>
            <Grid item sm={12} className={classes.grid}>
              <Paper className={classes.artwork} variant="outlined">
                <Typography variant="h6" align="center">
                  Saved artwork
                </Typography>
                {state.artwork.length ? (
                  <Gallery elements={state.artwork} />
                ) : (
                  <Typography variant="h6" align="center">
                    You have no saved artwork
                  </Typography>
                )}
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default SavedArtwork;
