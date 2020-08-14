import { CircularProgress, Grid } from "@material-ui/core";
import { withSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import SelectInput from "../../components/SelectInput/SelectInput.js";
import ArtworkPanel from "../../containers/ArtworkPanel/ArtworkPanel.js";
import { Context } from "../../context/Store.js";
import { getArtwork } from "../../services/artwork.js";

const Home = ({ location, enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    alerts: [],
    artwork: [],
    hasMore: true,
    dataCursor: 0,
    dataCeiling: 50,
  });

  const classes = {};

  const fetchArtwork = async () => {
    try {
      // DATABASE DATA
      const { data } = await getArtwork({
        dataCursor: state.dataCursor,
        dataCeiling: state.dataCeiling,
      });
      setState({
        ...state,
        loading: false,
        artwork: data.artwork,
        hasMore: data.artwork.length < state.dataCeiling ? false : true,
        dataCursor: state.dataCursor + state.dataCeiling,
      });

      // MOCK DATA
      /*       const formattedArtwork = mockArtwork.data.map((artwork) => {
        return {
          comments: [],
          reviews: [],
          _id: artwork.id,
          created: artwork.created_utc,
          owner: { _id: artwork.id, name: artwork.author },
          active: true,
          current: {
            _id: artwork.id,
            cover: artwork.thumbnail,
            height: artwork.thumbnail_height,
            width: artwork.thumbnail_width,
            created: artwork.created_utc,
            title: artwork.title,
            type: 'commercial',
            availability: 'available',
            license: 'commercial',
            use: 'separate',
            personal: 20,
            commercial: 45,
            description: artwork.title,
            id: artwork.id,
          },
          saves: 0,
        };
      });
      setState({
        ...state,
        loading: false,
        artwork: formattedArtwork,
        hasMore: formattedArtwork.length < state.dataCeiling ? false : true,
        dataCursor: state.dataCursor + state.dataCeiling,
      }); */
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchArtwork();
    if (location.state && location.state.message) {
      enqueueSnackbar(location.state.message, {
        variant: "success",
        autoHideDuration: 1000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    }
  }, []);

  const loadMore = async () => {
    try {
      const { data } = await getArtwork({
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
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.grid}>
        <SelectInput
          name="artworkType"
          label="Type"
          options={[
            { value: "" },
            { value: "available", text: "Available for download" },
            { value: "unavailable", text: "Only for preview" },
            { value: "free", text: "Free of charge" },
          ]}
          margin="dense"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} className={classes.grid}>
        {state.loading ? (
          <CircularProgress />
        ) : state.artwork.length ? (
          <ArtworkPanel
            elements={state.artwork}
            hasMore={state.hasMore}
            loadMore={loadMore}
            type="artwork"
          />
        ) : (
          "No artwork"
        )}
      </Grid>
    </Grid>
  );
};

export default withSnackbar(Home);
