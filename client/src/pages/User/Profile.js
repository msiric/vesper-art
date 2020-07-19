import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../../context/Store.js';
import { makeStyles } from '@material-ui/core/styles';
import SelectInput from '../../shared/SelectInput/SelectInput.js';
import { useFormik } from 'formik';
import UploadInput from '../../shared/UploadInput/UploadInput.js';
import {
  AppBar,
  Tab,
  Box,
  Tabs,
  Modal,
  Container,
  Grid,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Paper,
  Button,
  Link as Anchor,
} from '@material-ui/core';
import {
  EditRounded as EditIcon,
  LinkRounded as CopyIcon,
} from '@material-ui/icons';
import {
  FacebookShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  RedditIcon,
  TwitterIcon,
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withSnackbar } from 'notistack';
import { Link, useHistory } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import InfiniteScroll from 'react-infinite-scroll-component';
import { format } from 'date-fns';
import {
  postMedia,
  patchUser,
  getSaves,
  getUser,
} from '../../services/user.js';
import { getArtwork } from '../../services/artwork.js';
import { profileValidation } from '../../validation/profile.js';
import { countries } from '../../../../common/constants.js';
import UserProfilePanel from '../../containers/UserProfilePanel/UserProfilePanel.js';
import EditUserForm from '../../containers/EditUserForm/EditUserForm.js';
import UserProfileBanner from '../../containers/UserProfileBanner/UserProfileBanner.js';
import UserArtworkPanel from '../../containers/UserArtworkPanel/UserArtworkPanel.js';

const Profile = ({ match, enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    user: {},
    tabs: { value: 0, revealed: false },
    modal: { open: false },
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
  });
  const url = window.location;
  const title = store.main.brand;
  const history = useHistory();

  const {
    isSubmitting,
    setFieldValue,
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      userMedia: state.user.photo,
      userDescription: state.user.description,
      userCountry: state.user.country,
    },
    validationSchema: profileValidation,
    async onSubmit(values) {
      try {
        if (values.userMedia.length) {
          const formData = new FormData();
          formData.append('userMedia', values.userMedia[0]);
          const {
            data: { userMedia, userDimensions },
          } = await postMedia({ data: formData });
          values.userMedia = userMedia;
          values.userDimensions = userDimensions;
        }
        await patchUser({ userId: store.user.id, data: values });
      } catch (err) {
        console.log(err);
      }
    },
  });

  const classes = {};

  const fetchUser = async () => {
    try {
      const { data } = await getUser({
        userUsername: match.params.id,
        dataCursor: state.scroll.artwork.dataCursor,
        dataCeiling: state.scroll.artwork.dataCeiling,
      });
      // const {
      //   data: { artwork },
      // } = await ax.get(
      //   `/api/user/${user._id}/artwork?dataCursor=${state.dataCursor}&dataCeiling=${state.dataCeiling}`
      // );
      if (store.user.id === data.user._id) {
        setState({
          ...state,
          loading: false,
          user: { ...data.user, editable: true, artwork: data.artwork },
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
        });
      } else {
        setState({
          ...state,
          loading: false,
          user: { ...data.user, editable: false, artwork: data.artwork },
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
        });
      }
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const loadMoreArtwork = async () => {
    try {
      const { data } = await getArtwork({
        userId: state.user._id,
        dataCursor: state.scroll.artwork.dataCursor,
        dataCeiling: state.scroll.artwork.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
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
      const { data } = await getSaves({
        userId: state.user._id,
        dataCursor: state.scroll.saves.dataCursor,
        dataCeiling: state.scroll.saves.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        user: {
          ...prevState.user,
          savedArtwork: [...prevState.user.savedArtwork].concat(data.saves),
        },
        tabs: { ...prevState.tabs, value: newValue, revealed: true },
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
      'aria-controls': `full-width-tabpanel-${index}`,
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
    resetForm();
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
  }, []);

  return (
    <Container fixed className={classes.profile}>
      <Grid container className={classes.profile__container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.profile__loader}>
            <CircularProgress />
          </Grid>
        ) : state.user._id ? (
          <>
            <UserProfileBanner />
            <UserProfilePanel user={state.user} />
            <UserArtworkPanel
              tabs={state.tabs}
              user={state.user}
              loadMoreArtwork={loadMoreArtwork}
              loadMoreSaves={loadMoreSaves}
              handleTabsChange={handleTabsChange}
              handleChangeIndex={handleChangeIndex}
            />
          </>
        ) : (
          history.push('/')
        )}
        <Modal
          open={state.modal.open}
          onClose={handleModalClose}
          aria-labelledby="Edit info"
          className={classes.modal}
        >
          <EditUserForm user={state.user} handleModalClose={handleModalClose} />
        </Modal>
      </Grid>
    </Container>
  );
};

export default withSnackbar(Profile);
