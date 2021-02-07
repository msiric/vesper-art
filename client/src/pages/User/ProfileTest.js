import { Container, Grid } from "@material-ui/core";
import { withSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import EmptySection from "../../components/EmptySection/index.js";
import ProfileArtwork from "../../containers/ProfileArtwork/index.js";
import ProfileInfo from "../../containers/ProfileInfo/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { getArtwork } from "../../services/artwork.js";
import { getFavorites, getUser } from "../../services/user.js";
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
  const userId = useUserStore((state) => state.id);

  const [state, setState] = useState({
    ...initialState,
  });

  const globalClasses = globalStyles();

  const fetchUser = async () => {
    try {
      setState({ ...initialState });
      const { data } = await getUser.request({
        userUsername: match.params.id,
        cursor: state.scroll.artwork.cursor,
        limit: state.scroll.artwork.limit,
      });
      // const {
      //   data: { artwork },
      // } = await ax.get(
      //   `/api/user/${user.id}/artwork?cursor=${state.cursor}&limit=${state.limit}`
      // );
      if (userId === data.user.id) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          user: {
            ...data.user,
            editable: true,
            artwork: data.user.artwork.filter((item) => item.current !== null),
            favorites: [],
          },
          scroll: {
            ...prevState.scroll,
            artwork: {
              ...prevState.scroll.artwork,
              hasMore:
                data.user.artwork.length < prevState.scroll.artwork.limit
                  ? false
                  : true,
              cursor:
                data.user.artwork[data.user.artwork.length - 1] &&
                data.user.artwork[data.user.artwork.length - 1].id,
            },
          },
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          user: {
            ...data.user,
            editable: false,
            artwork: data.user.artwork.filter((item) => item.current !== null),
            favorites: [],
          },
          scroll: {
            ...prevState.scroll,
            artwork: {
              ...prevState.scroll.artwork,
              hasMore:
                data.user.artwork.length < prevState.scroll.artwork.limit
                  ? false
                  : true,
              cursor:
                data.user.artwork[data.user.artwork.length - 1] &&
                data.user.artwork[data.user.artwork.length - 1].id,
            },
          },
        }));
      }
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
        user: {
          ...prevState.user,
          artwork: [...prevState.user.artwork].concat(data.user.artwork),
        },
        scroll: {
          ...state.scroll,
          artwork: {
            ...state.scroll.artwork,
            hasMore:
              data.user.artwork.length < state.scroll.artwork.limit
                ? false
                : true,
            cursor:
              data.user.artwork[data.user.artwork.length - 1] &&
              data.user.artwork[data.user.artwork.length - 1].id,
          },
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const loadMoreFavorites = async (newValue) => {
    try {
      setState((prevState) => ({
        ...prevState,
        tabs: { ...prevState.tabs, value: newValue, revealed: true },
      }));
      const { data } = await getFavorites.request({
        userId: state.user.id,
        cursor: state.scroll.favorites.cursor,
        limit: state.scroll.favorites.limit,
      });
      setState((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          favorites: [...prevState.user.favorites].concat(data.favorites),
        },
        tabs: { ...prevState.tabs, loading: false },
        scroll: {
          ...state.scroll,
          favorites: {
            ...state.scroll,
            hasMore:
              data.favorites.length < state.scroll.favorites.limit
                ? false
                : true,
            cursor:
              data.favorites[data.favorites.length - 1] &&
              data.favorites[data.favorites.length - 1].id,
          },
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: true,
      },
    }));
  };

  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: false,
      },
    }));
  };

  const handleTabsChange = (e, newValue) => {
    if (!state.tabs.revealed) loadMoreFavorites(newValue);
    else
      setState((prevState) => ({
        ...prevState,
        tabs: { ...prevState.tabs, value: newValue },
      }));
  };

  const handleChangeIndex = (index) => {
    setState((prevState) => ({
      ...prevState,
      tabs: { ...prevState.tabs, value: index },
    }));
  };

  useEffect(() => {
    fetchUser();
  }, [location]);

  return state.loading || state.user.id ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <>
          <ProfileInfo
            user={state.user}
            handleModalOpen={handleModalOpen}
            loading={state.loading}
          />
          <ProfileArtwork
            tabs={state.tabs}
            user={state.user}
            loadMoreArtwork={loadMoreArtwork}
            loadMoreFavorites={loadMoreFavorites}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
            loading={state.loading}
          />
        </>
      </Grid>
    </Container>
  ) : (
    <EmptySection label="User not found" page />
  );
};

export default withSnackbar(Profile);
