import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Context } from '../Store/Store.js';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import {
  Container,
  Card,
  Grid,
  CircularProgress,
  Typography,
  CardContent,
  CardActions,
  TextField,
  Button,
} from '@material-ui/core';
import UploadInput from '../../shared/UploadInput/UploadInput.js';
import SelectInput from '../../shared/SelectInput/SelectInput.js';
import PriceInput from '../../shared/PriceInput/PriceInput.js';
import { ax } from '../../shared/Interceptor/Interceptor.js';
import { deleteEmptyValues } from '../../utils/helpers.js';
import EditArtworkStyles from './EditArtwork.style.js';
import {
  editArtwork,
  deleteArtwork,
  postMedia,
  patchArtwork,
} from '../../services/artwork.js';
import { getUser } from '../../services/stripe.js';
import EditArtworkForm from '../../containers/Artwork/EditArtworkForm.js';

const EditArtwork = ({ match }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    isDeleting: false,
    artwork: {},
    capabilities: {},
  });
  const history = useHistory();

  const classes = EditArtworkStyles();

  const fetchData = async () => {
    try {
      const {
        data: { artwork },
      } = await editArtwork({ artworkId: match.params.id });
      const {
        data: { capabilities },
      } = store.user.stripeId
        ? await getUser({ stripeId: store.user.stripeId })
        : { data: { capabilities: {} } };
      setState({
        ...state,
        loading: false,
        artwork: artwork,
        capabilities: capabilities,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handleDeleteArtwork = async () => {
    try {
      setState({ ...state, isDeleting: true });
      await deleteArtwork({ artworkId: match.params.id });
      history.push({
        pathname: '/',
        state: { message: 'Artwork deleted' },
      });
    } catch (err) {
      setState({ ...state, isDeleting: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.artwork._id ? (
          <Grid item sm={12} className={classes.container}>
            <EditArtworkForm />
          </Grid>
        ) : (
          history.push('/')
        )}
      </Grid>
    </Container>
  );
};

export default EditArtwork;
