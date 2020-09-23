import { CircularProgress, Container, Grid } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MainHeading from '../../components/MainHeading/MainHeading.js';
import EditArtworkForm from '../../containers/Artwork/EditArtworkForm.js';
import { Context } from '../../context/Store.js';
import {
  deleteArtwork,
  editArtwork,
  patchArtwork,
} from '../../services/artwork.js';
import { getUser } from '../../services/stripe.js';
import { deleteEmptyValues } from '../../utils/helpers.js';

const EditArtwork = ({ match }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    isDeleting: false,
    artwork: {},
    fileInput: null,
    capabilities: {},
  });
  const history = useHistory();

  const classes = {};

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
      await deleteArtwork({
        artworkId: state.artwork._id,
        data: state.artwork.current._id,
      });
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
            <MainHeading text={'Edit artwork'} />
            <EditArtworkForm
              loading={state.loading}
              capabilities={state.capabilities}
              version={state.artwork.current}
              user={store.user}
              patchArtwork={patchArtwork}
              deleteEmptyValues={deleteEmptyValues}
              handleDeleteArtwork={handleDeleteArtwork}
            />
          </Grid>
        ) : (
          history.push('/')
        )}
      </Grid>
    </Container>
  );
};

export default EditArtwork;
