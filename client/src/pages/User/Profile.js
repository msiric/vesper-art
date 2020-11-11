import { Container, Grid } from "@material-ui/core";
import { withSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import EmptySection from "../../components/EmptySection/index.js";
import ProfileArtwork from "../../containers/ProfileArtwork/index.js";
import ProfileInfo from "../../containers/ProfileInfo/index.js";
import { UserContext } from "../../contexts/User.js";
import { getArtwork } from "../../services/artwork.js";
import { getSaves, getUser } from "../../services/user.js";
import globalStyles from "../../styles/global.js";

const initialState = {
  loading: true,
  user: { artwork: {}, savedArtwork: [] },
  tabs: { value: 0, revealed: false, loading: true },
  scroll: {
    artwork: {
      hasMore: true,
      dataCursor: 0,
      dataCeiling: 20,
    },
    saves: {
      hasMore: true,
      dataCursor: 0,
      dataCeiling: 20,
    },
  },
};

const Profile = ({ match, location }) => {
  const [userStore] = useContext(UserContext);
  const [state, setState] = useState({
    ...initialState,
  });
  const url = window.location;
  const title = "test"; //$TODO store.main.brand;
  const history = useHistory();

  const globalClasses = globalStyles();

  const fetchUser = async () => {
    try {
      setState({ ...initialState });
      const { data } = await getUser.request({
        userUsername: match.params.id,
        dataCursor: state.scroll.artwork.dataCursor,
        dataCeiling: state.scroll.artwork.dataCeiling,
      });
      // const {
      //   data: { artwork },
      // } = await ax.get(
      //   `/api/user/${user._id}/artwork?dataCursor=${state.dataCursor}&dataCeiling=${state.dataCeiling}`
      // );
      if (userStore.id === data.user._id) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          user: {
            ...data.user,
            editable: true,
            artwork: data.artwork.filter((item) => item.current !== null),
            savedArtwork: [],
          },
          scroll: {
            ...prevState.scroll,
            artwork: {
              ...prevState.scroll.artwork,
              hasMore:
                data.artwork.length < prevState.scroll.artwork.dataCeiling
                  ? false
                  : true,
              dataCursor:
                prevState.scroll.artwork.dataCursor +
                prevState.scroll.artwork.dataCeiling,
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
            artwork: data.artwork.filter((item) => item.current !== null),
            savedArtwork: [],
          },
          scroll: {
            ...prevState.scroll,
            artwork: {
              ...prevState.scroll.artwork,
              hasMore:
                data.artwork.length < prevState.scroll.artwork.dataCeiling
                  ? false
                  : true,
              dataCursor:
                prevState.scroll.artwork.dataCursor +
                prevState.scroll.artwork.dataCeiling,
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

  const loadMoreSaves = async (newValue) => {
    try {
      setState((prevState) => ({
        ...prevState,
        tabs: { ...prevState.tabs, value: newValue, revealed: true },
      }));
      const { data } = await getSaves.request({
        userId: state.user._id,
        dataCursor: state.scroll.saves.dataCursor,
        dataCeiling: state.scroll.saves.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          savedArtwork: [...prevState.user.savedArtwork].concat(data.saves),
        },
        tabs: { ...prevState.tabs, loading: false },
        scroll: {
          ...state.scroll,
          saves: {
            ...state.scroll.saves,
            hasMore:
              data.saves.length < state.scroll.saves.dataCeiling ? false : true,
            dataCursor:
              state.scroll.saves.dataCursor + state.scroll.saves.dataCeiling,
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
    if (!state.tabs.revealed) loadMoreSaves(newValue);
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

  return state.loading || state.user._id ? (
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
            loadMoreSaves={loadMoreSaves}
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
