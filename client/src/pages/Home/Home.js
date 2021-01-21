import { Grid } from "@material-ui/core";
import { withSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import ArtworkPanel from "../../containers/ArtworkPanel/index.js";
import HomeBanner from "../../containers/HomeBanner";
import { getArtwork } from "../../services/artwork.js";

const initialState = {
  loading: true,
  alerts: [],
  artwork: [],
  hasMore: true,
  cursor: 0,
  limit: 50,
};

const Home = ({ location }) => {
  const [state, setState] = useState({
    ...initialState,
  });

  const fetchArtwork = async () => {
    try {
      setState({ ...initialState });
      // DATABASE DATA
      const { data } = await getArtwork.request({
        cursor: initialState.cursor,
        limit: initialState.limit,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        artwork: data.artwork,
        hasMore: data.artwork.length < prevState.limit ? false : true,
        cursor: prevState.cursor + prevState.limit,
      }));

      // MOCK DATA
      // const formattedArtwork = mockArtwork.data.map((artwork) => {
      //   return {
      //     comments: [],
      //     reviews: [],
      //     id: artwork.id,
      //     created: artwork.created_utc,
      //     owner: { id: artwork.id, name: artwork.author },
      //     active: true,
      //     current: {
      //       id: artwork.id,
      //       cover: artwork.thumbnail,
      //       height: artwork.thumbnail_height,
      //       width: artwork.thumbnail_width,
      //       created: artwork.created_utc,
      //       title: artwork.title,
      //       type: "commercial",
      //       availability: "available",
      //       license: "commercial",
      //       use: "separate",
      //       personal: 20,
      //       commercial: 45,
      //       description: artwork.title,
      //       id: artwork.id,
      //     },
      //     favorites: 0,
      //   };
      // });
      // setState((prevState) => ({
      //   ...state,
      //   loading: false,
      //   artwork: formattedArtwork,
      //   hasMore: formattedArtwork.length < prevState.limit ? false : true,
      //   cursor: prevState.cursor + prevState.limit,
      // }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    fetchArtwork();
  }, [location.key]);

  const loadMore = async () => {
    try {
      const { data } = await getArtwork.request({
        cursor: state.cursor,
        limit: state.limit,
      });
      setState((prevState) => ({
        ...prevState,
        artwork: [prevState.artwork].concat(data.artwork),
        hasMore: data.artwork.length >= prevState.limit,
        cursor: prevState.cursor + prevState.limit,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return [
    <Grid
      container
      style={{ width: "100%", margin: 0, padding: "0 32px" }}
      spacing={3}
    >
      <HomeBanner />
    </Grid>,
    <Grid
      container
      style={{ width: "100%", margin: 0, padding: "0 32px" }}
      spacing={3}
    >
      <Grid item xs={12} style={{ marginTop: 32 }}>
        {state.loading || state.artwork.length ? (
          <ArtworkPanel
            elements={state.artwork}
            hasMore={state.hasMore}
            loadMore={loadMore}
            type="artwork"
            loading={state.loading}
          />
        ) : (
          "No artwork"
        )}
      </Grid>
    </Grid>,
  ];
};

export default withSnackbar(Home);
