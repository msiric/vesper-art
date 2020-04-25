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
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ListItemIcon,
  ListSubheader,
  Switch,
  Link as Anchor,
} from '@material-ui/core';
import {
  CheckCircleRounded as ConfirmIcon,
  MoreVertRounded as MoreIcon,
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
  CancelRounded as CancelIcon,
  FavoriteRounded as SaveIcon,
  ShareRounded as ShareIcon,
  ShoppingBasketRounded as PurchaseIcon,
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
    panel: {
      expanded: '',
    },
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
        panel: {
          expanded: false,
        },
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handlePanelChange = (visible) => (e, isExpanded) => {
    setState((prevState) => ({
      ...prevState,
      panel: { ...prevState.panel, expanded: isExpanded ? visible : '' },
    }));
  };

  const handleSwitchToggle = (key, value) => () => {
    setState((prevState) => ({
      ...prevState,
      user: { ...prevState.user, [key]: value },
    }));
  };

  const handleSavePreferences = () => {
    console.log('ae');
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
              <div className={classes.root}>
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel1'}
                  onChange={handlePanelChange('panel1')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel1' ? (
                        <CancelIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography className={classes.heading}>
                      Change email address
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      {state.user.email}{' '}
                      {state.user.verified ? (
                        <Chip
                          label="Verified"
                          clickable
                          color="primary"
                          onDelete={() => null}
                          deleteIcon={<CheckIcon />}
                        />
                      ) : (
                        <Chip
                          label="Not verified"
                          clickable
                          color="error"
                          onDelete={() => null}
                        />
                      )}
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      Nulla facilisi. Phasellus sollicitudin nulla et quam
                      mattis feugiat. Aliquam eget maximus est, id dignissim
                      quam.
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel2'}
                  onChange={handlePanelChange('panel2')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel2' ? (
                        <CancelIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <Typography className={classes.heading}>
                      Change password
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      *********
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      Donec placerat, lectus sed mattis semper, neque lectus
                      feugiat lectus, varius pulvinar diam eros in elit.
                      Pellentesque convallis laoreet laoreet.
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel3'}
                  onChange={handlePanelChange('panel3')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel3' ? (
                        <CancelIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                  >
                    <Typography className={classes.heading}>
                      Preferences
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      Change purchases and saved artwork visibility
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.column}>
                    <List
                      subheader={
                        <ListSubheader>Display publicly:</ListSubheader>
                      }
                      className={classes.list}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <PurchaseIcon />
                        </ListItemIcon>
                        <ListItemText
                          id="switch-list-label-purchases"
                          primary="Purchases"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            edge="end"
                            onChange={handleSwitchToggle(
                              'displayPurchases',
                              !state.user.displayPurchases
                            )}
                            checked={state.user.displayPurchases}
                            inputProps={{
                              'aria-labelledby': 'switch-list-label-purchases',
                            }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <SaveIcon />
                        </ListItemIcon>
                        <ListItemText
                          id="switch-list-label-saves"
                          primary="Saved artwork"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            edge="end"
                            onChange={handleSwitchToggle(
                              'displaySaves',
                              !state.user.displaySaves
                            )}
                            checked={state.user.displaySaves}
                            inputProps={{
                              'aria-labelledby': 'switch-list-label-saves',
                            }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      startIcon={<ConfirmIcon />}
                      onClick={handleSavePreferences}
                      fullWidth
                    >
                      Save
                    </Button>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel4'}
                  onChange={handlePanelChange('panel4')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel4' ? (
                        <CancelIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                  >
                    <Typography className={classes.heading}>
                      Payment and billing
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      Change payment method and billing information
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      Change payment method and billing information
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <br />
                <ExpansionPanel
                  expanded={state.panel.expanded === 'panel5'}
                  onChange={handlePanelChange('panel5')}
                >
                  <ExpansionPanelSummary
                    expandIcon={
                      state.panel.expanded === 'panel5' ? (
                        <CancelIcon />
                      ) : (
                        <EditIcon />
                      )
                    }
                    aria-controls="panel5bh-content"
                    id="panel4bh-header"
                  >
                    <Typography className={classes.heading}>
                      Account settings
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      Deactivate account
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>Deactivate account</Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
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
