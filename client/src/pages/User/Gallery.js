import { Card, Container, Grid } from "@material-ui/core";
import FsLightbox from "fslightbox-react";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { hexToRgb } from "../../../../common/helpers.js";
import MainHeading from "../../components/MainHeading/index.js";
import GalleryPanel from "../../containers/GalleryPanel/index.js";
import { UserContext } from "../../contexts/User.js";
import { getArtwork } from "../../services/artwork.js";
import { getDownload } from "../../services/orders.js";
import { getMedia, getOwnership } from "../../services/user.js";
import globalStyles from "../../styles/global.js";

const initialState = {
  loading: true,
  user: { artwork: [], purchases: [] },
  gallery: { open: false, id: null },
  display: "purchases",
  scroll: {
    artwork: {
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
      setState((prevState) => ({ ...prevState, loading: false }));
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

  const formatArtwork = (artwork) => {
    const artworkIds = {};
    const uniqueArt = [];
    for (let i = 0; i < artwork.length; i++) {
      if (!artworkIds[artwork[i].version._id]) {
        uniqueArt.push(artwork[i]);
        artworkIds[artwork[i].version._id] = true;
      }
    }
    return uniqueArt;
  };

  const formatGallery = (artwork) => {
    const artworkIds = {};
    const uniqueArt = [];
    const uniqueAttributes = [];
    for (let i = 0; i < artwork.length; i++) {
      if (!artworkIds[artwork[i].version._id]) {
        const { r, g, b } = hexToRgb(artwork[i].version.dominant);
        uniqueArt.push(artwork[i].version.cover);
        uniqueAttributes.push({
          style: {
            boxShadow: `0px 0px 60px 35px rgba(${r},${g},${b},0.75)`,
            borderRadius: 4,
          },
        });
        artworkIds[artwork[i].version._id] = true;
      }
    }
    return { art: uniqueArt, attributes: uniqueAttributes };
  };

  const handleGalleryToggle = async (identifier, cover) => {
    const { data } =
      state.display === "purchases"
        ? await getDownload.request({ orderId: identifier })
        : await getMedia.request({
            userId: userStore.id,
            versionId: identifier,
          });
    console.log(data);
    setState((prevState) => ({
      ...prevState,
      gallery: { ...prevState.gallery, open: !prevState.gallery.open, cover },
    }));
  };

  const handleMediaFetch = async (id) => {
    try {
      const { data } =
        state.display === "purchases"
          ? getDownload.request({ orderId: id })
          : await getMedia.request({ userId: userStore.id, versionId: id });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location]);

  const formattedArtwork = formatArtwork(state.user[state.display]);
  const formattedGallery = formatGallery(state.user[state.display]);

  return state.loading || userStore.id ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Card>
          <MainHeading text="Gallery" />
          <GalleryPanel
            artwork={formattedArtwork}
            handleGalleryToggle={handleGalleryToggle}
          />
          {state.loading ? null : (
            <FsLightbox
              source={state.gallery.id}
              toggler={state.gallery.open}
              sources={formattedGallery.art}
              customAttributes={formattedGallery.attributes}
              type="image"
              exitFullscreenOnClose
            />
          )}
        </Card>
      </Grid>
    </Container>
  ) : (
    "$TODO Ne postoji"
  );
};

export default Gallery;
