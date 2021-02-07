import { Container, Grid } from "@material-ui/core";
import { withSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import EmptySection from "../../components/EmptySection/index.js";
import ProfileArtwork from "../../containers/ProfileArtwork/index.js";
import ProfileInfo from "../../containers/ProfileInfo/index.js";
import { useUserArtwork } from "../../contexts/local/userArtwork";
import { useUserProfile } from "../../contexts/local/userProfile";
import globalStyles from "../../styles/global.js";

const initialState = {
  loading: true,
  user: { artwork: {}, favorites: [], avatar: {} },
  tabs: { value: 0, revealed: false, loading: true },
  scroll: {
    artwork: {
      hasMore: true,
      cursor: "",
      limit: 20,
    },
    favorites: {
      hasMore: true,
      cursor: "",
      limit: 20,
    },
  },
};

const Profile = ({ match, location }) => {
  const resetProfile = useUserProfile((state) => state.resetProfile);
  const resetArtwork = useUserArtwork((state) => state.resetArtwork);
  const paramId = match.params.id;
  const artworkFetched = useRef(false);
  const artworkRef = useRef(null);

  const reinitializeState = () => {
    resetProfile();
    resetArtwork();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  const [state, setState] = useState({
    ...initialState,
  });

  const globalClasses = globalStyles();

  // const fetchUser = async () => {
  //   try {
  //     setState({ ...initialState });
  //     const { data } = await getUser.request({
  //       userUsername: match.params.id,
  //       cursor: state.scroll.artwork.cursor,
  //       limit: state.scroll.artwork.limit,
  //     });
  //     // const {
  //     //   data: { artwork },
  //     // } = await ax.get(
  //     //   `/api/user/${user.id}/artwork?cursor=${state.cursor}&limit=${state.limit}`
  //     // );
  //     setState((prevState) => ({
  //       ...prevState,
  //       loading: false,
  //       user: {
  //         ...data.user,
  //         editable: userId === data.user.id,
  //         artwork: data.user.artwork.filter((item) => item.current !== null),
  //         favorites: [],
  //       },
  //       scroll: {
  //         ...prevState.scroll,
  //         artwork: {
  //           ...prevState.scroll.artwork,
  //           hasMore:
  //             data.user.artwork.length < prevState.scroll.artwork.limit
  //               ? false
  //               : true,
  //           cursor:
  //             data.user.artwork[data.user.artwork.length - 1] &&
  //             data.user.artwork[data.user.artwork.length - 1].id,
  //         },
  //       },
  //     }));
  //   } catch (err) {
  //     setState((prevState) => ({ ...prevState, loading: false }));
  //   }
  // };

  // const loadMoreArtwork = async () => {
  //   try {
  //     const { data } = await getArtwork.request({
  //       userId: state.user.id,
  //       cursor: state.scroll.artwork.cursor,
  //       limit: state.scroll.artwork.limit,
  //     });
  //     setState((prevState) => ({
  //       ...prevState,
  //       user: {
  //         ...prevState.user,
  //         artwork: [...prevState.user.artwork].concat(data.user.artwork),
  //       },
  //       scroll: {
  //         ...state.scroll,
  //         artwork: {
  //           ...state.scroll.artwork,
  //           hasMore:
  //             data.user.artwork.length < state.scroll.artwork.limit
  //               ? false
  //               : true,
  //           cursor:
  //             data.user.artwork[data.user.artwork.length - 1] &&
  //             data.user.artwork[data.user.artwork.length - 1].id,
  //         },
  //       },
  //     }));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const loadMoreFavorites = async (newValue) => {
  //   try {
  //     setState((prevState) => ({
  //       ...prevState,
  //       tabs: { ...prevState.tabs, value: newValue, revealed: true },
  //     }));
  //     const { data } = await getFavorites.request({
  //       userId: state.user.id,
  //       cursor: state.scroll.favorites.cursor,
  //       limit: state.scroll.favorites.limit,
  //     });
  //     setState((prevState) => ({
  //       ...prevState,
  //       user: {
  //         ...prevState.user,
  //         favorites: [...prevState.user.favorites].concat(data.favorites),
  //       },
  //       tabs: { ...prevState.tabs, loading: false },
  //       scroll: {
  //         ...state.scroll,
  //         favorites: {
  //           ...state.scroll,
  //           hasMore:
  //             data.favorites.length < state.scroll.favorites.limit
  //               ? false
  //               : true,
  //           cursor:
  //             data.favorites[data.favorites.length - 1] &&
  //             data.favorites[data.favorites.length - 1].id,
  //         },
  //       },
  //     }));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchUser();
  // }, [location]);

  return state.loading || state.user.id ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <>
          <ProfileInfo paramId={paramId} />
          <ProfileArtwork
            paramId={paramId}
            artworkRef={artworkRef}
            artworkFetched={artworkFetched}
          />
        </>
      </Grid>
    </Container>
  ) : (
    <EmptySection label="User not found" page />
  );
};

export default withSnackbar(Profile);
