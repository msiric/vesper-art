import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import SelectInput from '../../shared/SelectInput/SelectInput';
import { useFormik, Formik, Form, Field } from 'formik';
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
import { Link, useHistory } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import ax from '../../axios.config';
import ProfileStyles from './Profile.style';

const Profile = ({ match }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    user: {},
    tabs: { value: 0 },
  });
  const history = useHistory();

  const classes = ProfileStyles();

  const fetchUser = async () => {
    try {
      const { data } = await ax.get(`/api/user/${match.params.id}`);
      setState({
        ...state,
        loading: false,
        user: { ...data.user, artwork: data.artwork },
      });
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
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} className={classes.grid}>
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
                        <Gallery elements={state.user.artwork} />
                      ) : (
                        <Typography variant="h6" align="center">
                          This user has no artwork to display
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
                  </SwipeableViews>
                </div>
              </Paper>
            </Grid>
          </>
        ) : (
          history.push('/')
        )}
      </Grid>
    </Container>
  );
};

export default Profile;
