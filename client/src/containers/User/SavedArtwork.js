import {
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getSaves } from "../../services/artwork.js";
import Gallery from "../Home/Gallery.js";
import { Context } from "../Store/Store.js";
import SavedArtworkStyles from "./SavedArtwork.style.js";

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
      const { data } = await getSaves({ userId: store.user.id });
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
    <Container className={classes.fixed}>
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
                  <Gallery elements={state.artwork} type="artwork" />
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
