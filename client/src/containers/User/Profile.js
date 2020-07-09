import React, { useContext, useState, useEffect } from "react";
import { Context } from "../Store/Store.js";
import SelectInput from "../../shared/SelectInput/SelectInput.js";
import { useFormik, Formik, Form, Field } from "formik";
import UploadInput from "../../shared/UploadInput/UploadInput.js";
import * as Yup from "yup";
import Gallery from "../Home/Gallery.js";
import {
  AppBar,
  Tab,
  Box,
  Tabs,
  Modal,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  ListItemSecondaryAction,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Paper,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Popover,
  Link as Anchor,
} from "@material-ui/core";
import {
  MoreVertRounded as MoreIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  FavoriteBorderRounded as SaveIcon,
  FavoriteRounded as SavedIcon,
  ShareRounded as ShareIcon,
  LinkRounded as CopyIcon,
} from "@material-ui/icons";
import {
  FacebookShareButton,
  WhatsappShareButton,
  RedditShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  RedditIcon,
  TwitterIcon,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withSnackbar } from "notistack";
import { Link, useHistory } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import InfiniteScroll from "react-infinite-scroll-component";
import { format } from "date-fns";
import { ax } from "../../shared/Interceptor/Interceptor.js";
import ProfileStyles from "./Profile.style.js";
import {
  postMedia,
  patchUser,
  getSaves,
  getUser,
} from "../../services/user.js";
import { getArtwork } from "../../services/artwork.js";
import { profileValidation } from "../../validation/profile.js";

const userMediaConfig = {
  size: 500 * 1024,
  format: ["image/jpg", "image/jpeg", "image/gif", "image/png"],
};

const Profile = ({ match, enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    user: {},
    modal: { open: false },
    tabs: { value: 0, revealed: false },
    scroll: {
      artwork: {
        hasMore: true,
        cursor: 0,
        ceiling: 20,
      },
      saves: {
        hasMore: true,
        cursor: 0,
        ceiling: 20,
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
          formData.append("userMedia", values.userMedia[0]);
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

  const classes = ProfileStyles();

  const fetchUser = async () => {
    try {
      const { data } = await getUser({
        username: match.params.id,
        cursor: state.scroll.artwork.cursor,
        ceiling: state.scroll.artwork.ceiling,
      });
      // const {
      //   data: { artwork },
      // } = await ax.get(
      //   `/api/user/${user._id}/artwork?cursor=${state.cursor}&ceiling=${state.ceiling}`
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
                data.artwork.length < state.scroll.artwork.ceiling
                  ? false
                  : true,
              cursor:
                state.scroll.artwork.cursor + state.scroll.artwork.ceiling,
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
                data.artwork.length < state.scroll.artwork.ceiling
                  ? false
                  : true,
              cursor:
                state.scroll.artwork.cursor + state.scroll.artwork.ceiling,
            },
          },
        });
      }
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
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

  const loadMoreArtwork = async () => {
    try {
      const { data } = await getArtwork({
        userId: state.user._id,
        cursor: state.scroll.artwork.cursor,
        ceiling: state.scroll.artwork.ceiling,
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
              data.artwork.length < state.scroll.artwork.ceiling ? false : true,
            cursor: state.scroll.artwork.cursor + state.scroll.artwork.ceiling,
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
        cursor: state.scroll.saves.cursor,
        ceiling: state.scroll.saves.ceiling,
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
              data.saves.length < state.scroll.saves.ceiling ? false : true,
            cursor: state.scroll.saves.cursor + state.scroll.saves.ceiling,
          },
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.user._id ? (
          <>
            <Grid item xs={12} md={4} className={classes.grid}>
              <Paper className={classes.paper}>
                <Card className={classes.user}>
                  <CardMedia
                    className={classes.avatar}
                    image={state.user.photo}
                    title={state.user.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      <Anchor component={Link} to={`/user/${state.user.name}`}>
                        {state.user.name}
                      </Anchor>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {state.user.description ||
                        "This user doesn't have much to say about themself"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {store.user.country
                        ? countries.find(
                            (country) => country.value === store.user.country
                          ).text
                        : "This user doesn't want to reveal their origin"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {`Joined ${format(
                        new Date(state.user.created),
                        "MMM yyyy"
                      )}`}
                    </Typography>
                  </CardContent>
                </Card>
                {state.user.editable ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<EditIcon />}
                    onClick={handleModalOpen}
                    fullWidth
                  >
                    Edit info
                  </Button>
                ) : null}

                <br />
                <br />
                <Card className={classes.user}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Share this artist
                    </Typography>
                    <div className={classes.shareContainer}>
                      <div className={classes.socialContainer}>
                        <div className={classes.copyButton}>
                          <CopyToClipboard
                            text={url}
                            onCopy={() =>
                              enqueueSnackbar("Link copied", {
                                variant: "success",
                                autoHideDuration: 1000,
                                anchorOrigin: {
                                  vertical: "top",
                                  horizontal: "center",
                                },
                              })
                            }
                          >
                            <CopyIcon />
                          </CopyToClipboard>
                        </div>
                        Copy link
                      </div>
                      <div className={classes.socialContainer}>
                        <FacebookShareButton
                          url={url}
                          quote={title}
                          className={classes.socialButton}
                        >
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        Facebook
                      </div>
                      <div className={classes.socialContainer}>
                        <TwitterShareButton
                          url={url}
                          title={title}
                          className={classes.socialButton}
                        >
                          <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        Twitter
                      </div>
                      <div className={classes.socialContainer}>
                        <RedditShareButton
                          url={url}
                          title={title}
                          windowWidth={660}
                          windowHeight={460}
                          className={classes.socialButton}
                        >
                          <RedditIcon size={32} round />
                        </RedditShareButton>
                        Reddit
                      </div>
                      <div className={classes.socialContainer}>
                        <WhatsappShareButton
                          url={url}
                          title={title}
                          separator=":: "
                          className={classes.socialButton}
                        >
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        WhatsApp
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} className={classes.grid}>
              {state.user.editable ? (
                <Paper className={classes.artwork} variant="outlined">
                  <div className={classes.tabs}>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={state.tabs.value}
                        onChange={handleTabsChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                      >
                        <Tab label="User artwork" {...a11yProps(0)} />
                        <Tab label="Saved artwork" {...a11yProps(1)} />
                      </Tabs>
                    </AppBar>
                    <SwipeableViews
                      axis="x"
                      index={state.tabs.value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <Box hidden={state.tabs.value !== 0}>
                        {state.user.artwork.length ? (
                          <Gallery
                            elements={state.user.artwork}
                            hasMore={state.scroll.artwork.hasMore}
                            loadMore={loadMoreArtwork}
                            type="artwork"
                          />
                        ) : (
                          <Typography variant="h6" align="center">
                            You have no artwork to display
                          </Typography>
                        )}
                      </Box>
                      <Box hidden={state.tabs.value !== 1}>
                        {state.user.savedArtwork.length ? (
                          <Gallery
                            elements={state.user.savedArtwork}
                            hasMore={state.scroll.saves.hasMore}
                            loadMore={loadMoreSaves}
                            type="artwork"
                          />
                        ) : (
                          <Typography variant="h6" align="center">
                            You have no saved artwork
                          </Typography>
                        )}
                      </Box>
                    </SwipeableViews>
                  </div>
                </Paper>
              ) : (
                <Paper className={classes.artwork} variant="outlined">
                  <div className={classes.tabs}>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={state.tabs.value}
                        onChange={handleTabsChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                      >
                        <Tab label="User artwork" {...a11yProps(0)} />
                        {state.user.displaySaves ? (
                          <Tab label="Saved artwork" {...a11yProps(1)} />
                        ) : null}
                      </Tabs>
                    </AppBar>
                    <SwipeableViews
                      axis="x"
                      index={state.tabs.value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <Box hidden={state.tabs.value !== 0}>
                        {state.user.artwork.length ? (
                          <Gallery
                            elements={state.user.artwork}
                            hasMore={state.scroll.artwork.hasMore}
                            loadMore={loadMoreArtwork}
                            type="artwork"
                          />
                        ) : (
                          <Typography variant="h6" align="center">
                            This user has no artwork to display
                          </Typography>
                        )}
                      </Box>
                      {state.user.displaySaves ? (
                        <Box hidden={state.tabs.value !== 1}>
                          {state.user.savedArtwork.length ? (
                            <Gallery
                              elements={state.user.savedArtwork}
                              hasMore={state.scroll.saves.hasMore}
                              loadMore={loadMoreSaves}
                              type="artwork"
                            />
                          ) : (
                            <Typography variant="h6" align="center">
                              This user has no saved artwork
                            </Typography>
                          )}
                        </Box>
                      ) : null}
                    </SwipeableViews>
                  </div>
                </Paper>
              )}
            </Grid>
          </>
        ) : (
          history.push("/")
        )}
        <div>
          <Modal
            open={state.modal.open}
            onClose={handleModalClose}
            aria-labelledby="Edit info"
            className={classes.modal}
          >
            <form className={classes.userForm} onSubmit={handleSubmit}>
              <div className={classes.userContainer}>
                <Card className={classes.card}>
                  <Typography variant="h6" align="center">
                    Edit info
                  </Typography>
                  <CardContent>
                    <UploadInput
                      name="userMedia"
                      setFieldValue={setFieldValue}
                    />
                    <TextField
                      name="userDescription"
                      label="Description"
                      type="text"
                      value={values.userDescription}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={
                        touched.userDescription ? errors.userDescription : ""
                      }
                      error={
                        touched.userDescription &&
                        Boolean(errors.userDescription)
                      }
                      margin="dense"
                      variant="outlined"
                      fullWidth
                    />
                    <SelectInput
                      name="userCountry"
                      label="Country"
                      value={values.userCountry}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      helperText={touched.userCountry ? errors.userCountry : ""}
                      error={touched.userCountry && Boolean(errors.userCountry)}
                      options={countries}
                    />
                  </CardContent>
                  <CardActions className={classes.actions}>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      color="error"
                      onClick={handleModalClose}
                    >
                      Close
                    </Button>
                  </CardActions>
                </Card>
              </div>
            </form>
          </Modal>
        </div>
      </Grid>
    </Container>
  );
};

export default withSnackbar(Profile);