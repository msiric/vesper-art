import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import SelectInput from '../../shared/SelectInput/SelectInput';
import { useFormik, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Gallery from '../Home/Gallery';
import {
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
  Chip,
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
  EmailRounded as EmailIcon,
  DoneRounded as CheckIcon,
} from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import ax from '../../axios.config';
import SettingsStyles from './Settings.style';

const Settings = () => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    user: {},
  });
  const history = useHistory();

  const classes = SettingsStyles();

  const fetchSettings = async () => {
    try {
      const { data } = await ax.get(`/api/user/${store.user.id}/settings`);
      setState({
        ...state,
        loading: false,
        user: data.user,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.user._id ? (
          <Grid item sm={12} className={classes.grid}>
            <Paper className={classes.artwork} variant="outlined">
              <Typography variant="h6" align="center">
                Settings
              </Typography>
              <p>{state.user.email}</p>
              {state.user.verified ? (
                <Chip
                  icon={<EmailIcon />}
                  label="Email verified"
                  clickable
                  color="primary"
                  onDelete={() => null}
                  deleteIcon={<CheckIcon />}
                />
              ) : (
                <Chip
                  icon={<EmailIcon />}
                  label="Email not verified"
                  clickable
                  color="error"
                  onDelete={() => null}
                />
              )}
              <p>Change password</p>
              <p>Show purchases/saved artwork</p>
              <p>Notifications</p>
              <p>Payment method</p>
              <p>Billing information</p>
              <p>Deactivate account</p>
            </Paper>
          </Grid>
        ) : (
          history.push('/')
        )}
      </Grid>
    </Container>
  );
};

export default Settings;
