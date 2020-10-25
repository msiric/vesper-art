import { Card, Container, Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
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
  artwork: [],
  purchases: [],
  gallery: { open: false, id: null, key: 0 },
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
        artwork: data.artwork
          ? data.artwork.map((item) => ({ ...item, media: null }))
          : initialState.artwork,
        purchases: data.purchases
          ? data.purchases.map((item) => ({
              ...item,
              version: { ...item.version, media: null },
            }))
          : initialState.purchases,
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
        artwork: [...prevState.user.artwork].concat(data.artwork),
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
        const { r, g, b } = hexToRgb(artwork[i].version.dominant);
        uniqueArt.push({
          artwork: artwork[i],
          attributes: {
            boxShadow: `0px 0px 60px 35px rgba(${r},${g},${b},0.75)`,
            borderRadius: 4,
          },
        });
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
        uniqueArt.push(
          artwork[i].version.media
            ? artwork[i].version.media
            : artwork[i].version.cover
        );
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
    const foundMedia =
      state.display === "purchases"
        ? state[state.display].find((item) => item._id === identifier).version
            .media
        : state[state.display].find((item) => item._id === identifier).media;
    if (!foundMedia) {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      const { data } =
        state.display === "purchases"
          ? await getDownload.request({ orderId: identifier })
          : await getMedia.request({
              userId: userStore.id,
              versionId: identifier,
            });
      const newMedia =
        state.display === "purchases"
          ? state[state.display].map((item) => {
              if (item.version.cover === cover)
                return {
                  ...item,
                  version: { ...item.version, media: data.url },
                };
              return item;
            })
          : state[state.display].map((item) => {
              if (item.cover === cover) return { ...item, media: data.url };
              return item;
            });
      state.display === "purchases"
        ? setState((prevState) => ({
            ...prevState,
            purchases: newMedia,
            loading: false,
          }))
        : setState((prevState) => ({
            ...prevState,
            artwork: newMedia,
            loading: false,
          }));
    }
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

  const formattedArtwork = formatArtwork(state[state.display]);
  const formattedGallery = formatGallery(state[state.display]);

  const callbacks = {
    onSlideChange: (slide) => console.log(slide),
    onLightboxOpened: (current) => console.log(current),
    onLightboxClosed: (current) => console.log(current),
    onCountSlides: (total) => console.log(total),
  };

  return state.loading || userStore.id ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Card>
          <MainHeading text="Gallery" />
          <SimpleReactLightbox>
            <SRLWrapper callbacks={callbacks}>
              <GalleryPanel
                artwork={formattedArtwork}
                handleGalleryToggle={handleGalleryToggle}
                loading={state.loading}
              />
            </SRLWrapper>
          </SimpleReactLightbox>
        </Card>
      </Grid>
    </Container>
  ) : (
    "$TODO Ne postoji"
  );
};

export default Gallery;
