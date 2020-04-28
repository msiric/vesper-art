import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import SelectInput from '../../shared/SelectInput/SelectInput';
import { useFormik, Formik, Form, Field } from 'formik';
import UploadInput from '../../shared/UploadInput/UploadInput';
import * as Yup from 'yup';
import Gallery from '../Home/Gallery';
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
} from '@material-ui/core';
import {
  MoreVertRounded as MoreIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  FavoriteBorderRounded as SaveIcon,
  FavoriteRounded as SavedIcon,
  ShareRounded as ShareIcon,
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
import formatDate from '../../utils/formatDate';
import ax from '../../axios.config';
import ProfileStyles from './Profile.style';

const userPhotoConfig = {
  size: 500 * 1024,
  format: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
};

const userValidation = Yup.object().shape({
  userPhoto: Yup.mixed()
    .test(
      'fileSize',
      `File needs to be less than ${userPhotoConfig.size}MB`,
      (value) => value[0] && value[0].size <= userPhotoConfig.size
    )
    .test(
      'fileType',
      `File needs to be in one of the following formats: ${userPhotoConfig.format}`,
      (value) => value[0] && userPhotoConfig.format.includes(value[0].type)
    ),
  userDescription: Yup.string().trim(),
});

const Profile = ({ match, enqueueSnackbar }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    user: {},
    modal: { open: false },
    tabs: { value: 0 },
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
      userPhoto: state.user.photo,
      userDescription: state.user.description,
    },
    validationSchema: userValidation,
    async onSubmit(values) {
      try {
        if (values.userPhoto.length) {
          const formData = new FormData();
          formData.append('userPhoto', values.userPhoto[0]);
          const {
            data: { userPhoto },
          } = await ax.post('/api/profile_image_upload', formData);
          values.userPhoto = userPhoto;
        }
        await ax.patch(`/api/user/${store.user.id}`, values);
      } catch (err) {
        console.log(err);
      }
    },
  });

  const classes = ProfileStyles();

  const fetchUser = async () => {
    try {
      const { data } = await ax.get(`/api/user/${match.params.id}`);
      if (store.user.id === data.user._id) {
        setState({
          ...state,
          loading: false,
          user: { ...data.user, editable: true, artwork: data.artwork },
        });
      } else {
        setState({
          ...state,
          loading: false,
          user: { ...data.user, editable: false, artwork: data.artwork },
        });
      }
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  };

  const handleTabsChange = (event, newValue) => {
    setState((prevState) =>
      setState({ ...prevState, tabs: { value: newValue } })
    );
  };

  const handleChangeIndex = (index) => {
    setState((prevState) => setState({ ...prevState, tabs: { value: index } }));
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
                      {`Joined ${formatDate(state.user.created, 'month')}`}
                    </Typography>
                  </CardContent>
                </Card>
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
                              enqueueSnackbar('Link copied', {
                                variant: 'success',
                                autoHideDuration: 1000,
                                anchorOrigin: {
                                  vertical: 'top',
                                  horizontal: 'center',
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
                        <Tab label="Purchased artwork" {...a11yProps(2)} />
                      </Tabs>
                    </AppBar>
                    <SwipeableViews
                      axis="x"
                      index={state.tabs.value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <Box hidden={state.tabs.value !== 0}>
                        {state.user.artwork.length ? (
                          <Gallery elements={state.user.artwork} />
                        ) : (
                          <Typography variant="h6" align="center">
                            You have no artwork to display
                          </Typography>
                        )}
                      </Box>
                      <Box hidden={state.tabs.value !== 1}>
                        {state.user.savedArtwork.length ? (
                          <Gallery elements={state.user.savedArtwork} />
                        ) : (
                          <Typography variant="h6" align="center">
                            You have no saved artwork
                          </Typography>
                        )}
                      </Box>
                      <Box hidden={state.tabs.value !== 2}>
                        {state.user.purchasedArtwork.length ? (
                          <Gallery elements={state.user.purchasedArtwork} />
                        ) : (
                          <Typography variant="h6" align="center">
                            You have no purchased artwork
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
                        {state.user.displayPurchases ? (
                          <Tab label="Purchased artwork" {...a11yProps(2)} />
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
                          <Gallery elements={state.user.artwork} />
                        ) : (
                          <Typography variant="h6" align="center">
                            This user has no artwork to display
                          </Typography>
                        )}
                      </Box>
                      {state.user.displaySaves ? (
                        <Box hidden={state.tabs.value !== 1}>
                          {state.user.savedArtwork.length ? (
                            <Gallery elements={state.user.savedArtwork} />
                          ) : (
                            <Typography variant="h6" align="center">
                              This user has no saved artwork
                            </Typography>
                          )}
                        </Box>
                      ) : null}
                      {state.user.displayPurchases ? (
                        <Box hidden={state.tabs.value !== 2}>
                          {state.user.purchasedArtwork.length ? (
                            <Gallery elements={state.user.purchasedArtwork} />
                          ) : (
                            <Typography variant="h6" align="center">
                              This user has no purchased artwork
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
          history.push('/')
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
                      name="userPhoto"
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
                        touched.userDescription ? errors.userDescription : ''
                      }
                      error={
                        touched.userDescription &&
                        Boolean(errors.userDescription)
                      }
                      margin="dense"
                      variant="outlined"
                      fullWidth
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
