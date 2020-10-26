import {
  Card,
  Container,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SRLWrapper, useLightbox } from "simple-react-lightbox";
import { hexToRgb } from "../../../../common/helpers.js";
import MainHeading from "../../components/MainHeading/index.js";
import GalleryPanel from "../../containers/GalleryPanel/index.js";
import { UserContext } from "../../contexts/User.js";
import { getArtwork } from "../../services/artwork.js";
import { getDownload } from "../../services/orders.js";
import { getMedia, getOwnership } from "../../services/user.js";
import globalStyles from "../../styles/global.js";
import { artepunktTheme } from "../../styles/theme.js";

const initialState = {
  loading: true,
  artwork: {},
  purchases: {},
  covers: [],
  media: [],
  captions: [],
  index: null,
  display: "purchases",
  scroll: {
    artwork: {
      hasMore: true,
      dataCursor: 0,
      dataCeiling: 10,
    },
  },
};

const lightboxStyles = makeStyles({
  "@global": {
    ".SRLElementWrapper": {
      "&>img": {
        boxShadow: (props) => props.boxShadow,
      },
    },
  },
});

const Gallery = ({ match, location }) => {
  const [userStore] = useContext(UserContext);
  const [state, setState] = useState({
    ...initialState,
  });
  const history = useHistory();

  const globalClasses = globalStyles();

  const lightboxClasses = lightboxStyles({
    boxShadow: state.covers[state.index]
      ? state.covers[state.index].attributes.boxShadow
      : "",
  });

  const { openLightbox } = useLightbox();

  const formatArtwork = (artwork) => {
    const artworkIds = {};
    const uniqueCovers = [];
    const uniqueMedia = [];
    const uniqueCaptions = [];
    for (let item in artwork) {
      if (!artworkIds[artwork[item].cover]) {
        const { r, g, b } = hexToRgb(artwork[item].dominant);
        uniqueCovers.push({
          _id: item,
          cover: artwork[item].cover,
          media: artwork[item].media,
          height: artwork[item].height,
          width: artwork[item].width,
          attributes: {
            boxShadow: `0px 0px 60px 35px rgba(${r},${g},${b},0.75)`,
            borderRadius: 4,
          },
          dominant: artwork[item].dominant,
        });
        uniqueMedia.push({
          src: artwork[item].media ? artwork[item].media : artwork[item].cover,
          height: artwork[item].height,
          width: artwork[item].width,
        });
        uniqueCaptions.push({
          id: uniqueCaptions.length,
          caption: artwork[item].title,
        });
        artworkIds[artwork[item].cover] = true;
      }
    }
    return {
      covers: uniqueCovers,
      media: uniqueMedia,
      captions: uniqueCaptions,
    };
  };

  const fetchUser = async () => {
    try {
      setState((prevState) => ({
        ...initialState,
        display: prevState.display,
      }));
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
      const newArtwork = data[initialState.display].reduce((object, item) => {
        object[
          initialState.display === "purchases"
            ? item.version.cover
            : item.current.cover
        ] = {
          _id: item._id,
          title:
            initialState.display === "purchases"
              ? item.version.title
              : item.current.title,
          owner:
            initialState.display === "purchases"
              ? item.seller.name
              : item.current.owner,
          cover:
            initialState.display === "purchases"
              ? item.version.cover
              : item.current.cover,
          media: null,
          dominant:
            initialState.display === "purchases"
              ? item.version.dominant
              : item.current.dominant,
          height:
            initialState.display === "purchases"
              ? item.version.height
              : item.current.height,
          width:
            initialState.display === "purchases"
              ? item.version.width
              : item.current.width,
        };
        return object;
      }, {});
      const formattedArtwork = formatArtwork(newArtwork);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        [initialState.display]: newArtwork,
        covers: formattedArtwork.covers,
        media: formattedArtwork.media,
        captions: formattedArtwork.captions,
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

  const handleGalleryToggle = async (cover, index) => {
    const foundMedia = state.covers[index].media === cover;
    if (foundMedia) {
      setState((prevState) => ({
        ...prevState,
        index,
      }));
      openLightbox(index);
    } else {
      const identifier = state[state.display][cover]._id;
      setState((prevState) => ({
        ...prevState,
        loading: true,
        index,
      }));
      const { data } =
        state.display === "purchases"
          ? await getDownload.request({ orderId: identifier })
          : await getMedia.request({
              userId: userStore.id,
              versionId: identifier,
            });
      const newArtwork = {
        ...state[state.display],
        [cover]: {
          ...state[state.display][cover],
          media: data.url,
        },
      };
      const formattedArtwork = formatArtwork(newArtwork);
      setState((prevState) => ({
        ...prevState,
        [prevState.display]: newArtwork,
        covers: formattedArtwork.covers,
        media: formattedArtwork.media,
        captions: formattedArtwork.captions,
        loading: false,
        index,
      }));
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location, state.display]);

  useEffect(() => {
    if (state.index !== null) openLightbox(state.index);
  }, [state[state.display]]);

  const callbacks = {
    onSlideChange: (slide) =>
      handleGalleryToggle(slide.slides.current.source, slide.index),
  };

  const options = {
    buttons: {
      showDownloadButton: false,
    },
    settings: {
      autoplaySpeed: 30000,
      hideControlsAfter: 3000,
      lightboxTransitionSpeed: 0.3,
      overlayColor: "rgba(0, 0, 0, 0.99)",
      slideAnimationType: "slide",
      slideSpringValues: [30, 10],
      slideTransitionTimingFunction: "easeInOut",
    },
    thumbnails: {
      showThumbnails: false,
    },
    progressBar: {
      backgroundColor: "#000000",
      fillColor: artepunktTheme.palette.primary.main,
    },
  };

  const handleSelectChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      display: e.target.value,
    }));
  };

  return state.loading || userStore.id ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Card>
          <MainHeading text="Gallery" />
          <FormControl variant="outlined" style={{ marginBottom: "12px" }}>
            <InputLabel id="data-display">Display</InputLabel>
            <Select
              labelId="data-display"
              value={state.display}
              onChange={handleSelectChange}
              label="Display"
              margin="dense"
            >
              <MenuItem value="purchases">Purchases</MenuItem>
              <MenuItem value="artwork">Artwork</MenuItem>
            </Select>
          </FormControl>
          <GalleryPanel
            artwork={state.covers}
            handleGalleryToggle={handleGalleryToggle}
            index={state.index}
            loading={state.loading}
          />
          {!state.loading && (
            <SRLWrapper
              images={state.media}
              callbacks={callbacks}
              options={options}
              customCaptions={state.captions}
            ></SRLWrapper>
          )}
        </Card>
      </Grid>
    </Container>
  ) : (
    "$TODO Ne postoji"
  );
};

export default Gallery;
