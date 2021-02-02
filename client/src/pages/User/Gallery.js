import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SRLWrapper, useLightbox } from "simple-react-lightbox";
import { hexToRgb } from "../../../../common/helpers.js";
import EmptySection from "../../components/EmptySection/index.js";
import MainHeading from "../../components/MainHeading/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import GalleryPanel from "../../containers/GalleryPanel/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { getDownload } from "../../services/orders.js";
import { getArtwork, getMedia, getOwnership } from "../../services/user.js";
import globalStyles from "../../styles/global.js";
import { artepunktTheme } from "../../styles/theme.js";

const initialState = {
  loading: true,
  fetching: false,
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
      cursor: "",
      limit: 10,
    },
  },
};

const lightboxStyles = makeStyles({
  "@global": {
    ".SRLElementWrapper": {
      "&>img": {
        boxShadow: ({ boxShadow }) => boxShadow,
      },
    },
  },
});

const galleryStyles = makeStyles({
  galleryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const Gallery = ({ match, location }) => {
  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);

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

  const classes = galleryStyles();

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
          id: item,
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
          thumbnail: artwork[item].cover,
          height: artwork[item].height,
          width: artwork[item].width,
        });
        uniqueCaptions.push({
          id: uniqueCaptions.length,
          caption: (
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography style={{ fontWeight: "bold" }}>
                {artwork[item].title}
              </Typography>
              <Typography>{`\xa0by ${artwork[item].owner}`}</Typography>
            </Box>
          ),
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
              userId,
              cursor: state.scroll.artwork.cursor,
              limit: state.scroll.artwork.limit,
            })
          : await getArtwork.request({
              userId,
              cursor: state.scroll.artwork.cursor,
              limit: state.scroll.artwork.limit,
            });
      console.log("data", data);
      const newArtwork = data[state.display].reduce((object, item) => {
        object[
          state.display === "purchases"
            ? item.version.cover.source
            : item.current.cover.source
        ] = {
          id: item.id,
          title:
            state.display === "purchases"
              ? item.version.title
              : item.current.title,
          owner:
            state.display === "purchases" ? item.seller.name : userUsername,
          cover:
            state.display === "purchases"
              ? item.version.cover.source
              : item.current.cover.source,
          media: null,
          dominant:
            state.display === "purchases"
              ? item.version.cover.dominant
              : item.current.cover.dominant,
          height:
            state.display === "purchases"
              ? item.version.cover.height
              : item.current.cover.height,
          width:
            state.display === "purchases"
              ? item.version.cover.width
              : item.current.cover.width,
        };
        return object;
      }, {});
      const formattedArtwork = formatArtwork(newArtwork);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        [state.display]: newArtwork,
        covers: formattedArtwork.covers,
        media: formattedArtwork.media,
        captions: formattedArtwork.captions,
        scroll: {
          ...prevState.scroll,
          //   artwork: {
          //     ...prevState.scroll.artwork,
          //     hasMore:
          //       data.artwork.length < prevState.scroll.artwork.limit
          //         ? false
          //         : true,
          //     cursor:
          //       prevState.scroll.artwork.cursor +
          //       prevState.scroll.artwork.limit,
          //   },
          //   purchases: {
          //     ...prevState.scroll.artwork,
          //     hasMore:
          //       data.artwork.length < prevState.scroll.artwork.limit
          //         ? false
          //         : true,
          //     cursor:
          //       prevState.scroll.artwork.cursor +
          //       prevState.scroll.artwork.limit,
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
        userId: state.user.id,
        cursor: state.scroll.artwork.cursor,
        limit: state.scroll.artwork.limit,
      });
      setState((prevState) => ({
        ...prevState,
        artwork: [...prevState.user.artwork].concat(data.artwork),
        scroll: {
          ...state.scroll,
          artwork: {
            ...state.scroll.artwork,
            hasMore:
              data.artwork.length < state.scroll.artwork.limit ? false : true,
            cursor:
              data.artwork[data.artwork.length - 1] &&
              data.artwork[data.artwork.length - 1].id,
          },
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleGalleryToggle = async (item, index) => {
    const foundMedia = item.media && state.covers[index].media === item.media;
    const identifier = state[state.display][item.cover].id;
    if (foundMedia) {
      setState((prevState) => ({
        ...prevState,
        index,
      }));
      openLightbox(index);
    } else {
      setState((prevState) => ({
        ...prevState,
        fetching: true,
        index,
      }));
      const { data } =
        state.display === "purchases"
          ? await getDownload.request({ orderId: identifier })
          : await getMedia.request({
              userId,
              artworkId: identifier,
            });
      const newArtwork = {
        ...state[state.display],
        [item.cover]: {
          ...state[state.display][item.cover],
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
        fetching: false,
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
      handleGalleryToggle(
        {
          cover: slide.slides.current.thumbnail,
          media: slide.slides.current.source,
        },
        slide.index
      ),
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
      index: null,
    }));
  };

  return state.loading || userId ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Card
          style={{
            width: "100%",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardHeader
            title={
              <SkeletonWrapper variant="text" loading={state.loading}>
                <MainHeading text="Gallery" />
              </SkeletonWrapper>
            }
            subheader={
              <SkeletonWrapper loading={state.loading}>
                <FormControl
                  variant="outlined"
                  style={{ marginBottom: "12px" }}
                >
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
              </SkeletonWrapper>
            }
            disableTypography
            classes={{
              content: classes.galleryHeader,
            }}
          />
          <CardContent style={{ height: "100%" }}>
            <SkeletonWrapper loading={state.loading} width="100%" height="100%">
              {state.covers.length ? (
                <GalleryPanel
                  artwork={state.covers}
                  handleGalleryToggle={handleGalleryToggle}
                  index={state.index}
                  loading={state.fetching}
                />
              ) : (
                <EmptySection
                  label={
                    state.display === "purchases"
                      ? "You have no purchased artwork"
                      : "You have no published artwork"
                  }
                />
              )}
            </SkeletonWrapper>
            {!state.fetching && !state.loading && (
              <SRLWrapper
                images={state.media}
                callbacks={callbacks}
                options={options}
                customCaptions={state.captions}
              ></SRLWrapper>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Container>
  ) : (
    "$TODO Ne postoji"
  );
};

export default Gallery;
