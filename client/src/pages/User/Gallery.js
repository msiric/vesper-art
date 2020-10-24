import { Button, Container, Grid } from "@material-ui/core";
import FsLightbox from "fslightbox-react";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../contexts/User.js";
import { getArtwork } from "../../services/artwork.js";
import { getOwnership } from "../../services/user.js";
import globalStyles from "../../styles/global.js";

const initialState = {
  loading: true,
  user: { artwork: [], purchases: [] },
  open: false,
  display: "purchases",
  scroll: {
    artwork: {
      hasMore: true,
      dataCursor: 0,
      dataCeiling: 10,
    },
    purchases: {
      hasMore: true,
      dataCursor: 0,
      dataCeiling: 10,
    },
  },
};

const Gallery = ({ match, location }) => {
  const [userStore] = useContext(UserContext);
  const [state, setState] = useState({
    ...initialState,
  });
  const history = useHistory();

  const globalClasses = globalStyles();

  const fetchUser = async () => {
    try {
      setState({ ...initialState });
      const { data } =
        state.display === "purchases"
          ? await getOwnership.request({
              userId: userStore.id,
              dataCursor: state.scroll.artwork.dataCursor,
              dataCeiling: state.scroll.artwork.dataCeiling,
            })
          : await getArtwork.request({
              userId: userStore.id,
              dataCursor: state.scroll.artwork.dataCursor,
              dataCeiling: state.scroll.artwork.dataCeiling,
            });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        user: {
          artwork: data.artwork || initialState.user.artwork,
          purchases: data.purchases || initialState.user.purchases,
        },
        scroll: {
          ...prevState.scroll,
          //   artwork: {
          //     ...prevState.scroll.artwork,
          //     hasMore:
          //       data.artwork.length < prevState.scroll.artwork.dataCeiling
          //         ? false
          //         : true,
          //     dataCursor:
          //       prevState.scroll.artwork.dataCursor +
          //       prevState.scroll.artwork.dataCeiling,
          //   },
          //   purchases: {
          //     ...prevState.scroll.artwork,
          //     hasMore:
          //       data.artwork.length < prevState.scroll.artwork.dataCeiling
          //         ? false
          //         : true,
          //     dataCursor:
          //       prevState.scroll.artwork.dataCursor +
          //       prevState.scroll.artwork.dataCeiling,
          //   },
        },
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, open: false }));
    }
  };

  const loadMoreArtwork = async () => {
    try {
      const { data } = await getArtwork.request({
        userId: state.user._id,
        dataCursor: state.scroll.artwork.dataCursor,
        dataCeiling: state.scroll.artwork.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          artwork: [...prevState.user.artwork].concat(data.artwork),
        },
        scroll: {
          ...state.scroll,
          artwork: {
            ...state.scroll.artwork,
            hasMore:
              data.artwork.length < state.scroll.artwork.dataCeiling
                ? false
                : true,
            dataCursor:
              state.scroll.artwork.dataCursor +
              state.scroll.artwork.dataCeiling,
          },
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const fomatArtwork = (artwork) => {
    const artworkIds = {};
    const uniqueArt = [];
    for (let i = 0; i < artwork.length; i++) {
      if (!artworkIds[artwork[i].version._id]) {
        uniqueArt.push(artwork[i].version.cover);
        artworkIds[artwork[i].version._id] = true;
      }
    }
    return uniqueArt;
  };

  const handleGalleryToggle = () => {
    setState((prevState) => ({ ...prevState, open: !prevState.open }));
  };

  useEffect(() => {
    fetchUser();
  }, [location]);

  return state.loading || userStore.id ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Button variant="outlined" onClick={handleGalleryToggle}>
          Toggle gallery
        </Button>
        {state.loading ? null : (
          <FsLightbox
            toggler={state.open}
            sources={fomatArtwork(state.user[state.display])}
            type="image"
            exitFullscreenOnClose
          />
        )}
      </Grid>
    </Container>
  ) : (
    "$TODO Ne postoji"
  );
};

export default Gallery;
