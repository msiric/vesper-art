import { Box, Card, Grid } from "@material-ui/core";
import { withSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import Banner from "../../assets/images/banner/banner.jpg";
import ArtworkPanel from "../../containers/ArtworkPanel/index.js";
import { getArtwork } from "../../services/artwork.js";

const initialState = {
  loading: true,
  alerts: [],
  artwork: [],
  hasMore: true,
  dataCursor: 0,
  dataCeiling: 50,
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
        dataCursor: initialState.dataCursor,
        dataCeiling: initialState.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        artwork: data.artwork,
        hasMore: data.artwork.length < prevState.dataCeiling ? false : true,
        dataCursor: prevState.dataCursor + prevState.dataCeiling,
      }));

      // MOCK DATA
      // const formattedArtwork = mockArtwork.data.map((artwork) => {
      //   return {
      //     comments: [],
      //     reviews: [],
      //     _id: artwork.id,
      //     created: artwork.created_utc,
      //     owner: { _id: artwork.id, name: artwork.author },
      //     active: true,
      //     current: {
      //       _id: artwork.id,
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
      //     saves: 0,
      //   };
      // });
      // setState((prevState) => ({
      //   ...state,
      //   loading: false,
      //   artwork: formattedArtwork,
      //   hasMore: formattedArtwork.length < prevState.dataCeiling ? false : true,
      //   dataCursor: prevState.dataCursor + prevState.dataCeiling,
      // }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    fetchArtwork();
  }, [location]);

  const loadMore = async () => {
    try {
      const { data } = await getArtwork.request({
        dataCursor: state.dataCursor,
        dataCeiling: state.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        artwork: [prevState.artwork].concat(data.artwork),
        hasMore: data.artwork.length >= prevState.dataCeiling,
        dataCursor: prevState.dataCursor + prevState.dataCeiling,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid key={location.key} container>
      <Grid item xs={12} md={9}>
        <Box
          style={{
            height: 360,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${Banner})`,
            opacity: 0.3,
          }}
        ></Box>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        ></Card>
      </Grid>
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
    </Grid>
  );
};

export default withSnackbar(Home);
