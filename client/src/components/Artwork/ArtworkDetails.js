import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import Modal from '../../shared/Modal/Modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  Card,
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
  Link as Anchor,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import ax from '../../axios.config';
import ArtworkDetailsStyles from './ArtworkDetails.style';

const ArtworkDetails = ({ match }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    artwork: {},
    license: 'personal',
    modal: {
      open: false,
      body: ``,
    },
  });
  const history = useHistory();

  const classes = ArtworkDetailsStyles();

  const validationSchema = Yup.object().shape({
    licenseeName: Yup.string()
      .trim()
      .required('License holder name is required'),
    licenseeSurname: Yup.string()
      .trim()
      .required('License holder surname is required'),
    licenseeCompany: Yup.string()
      .notRequired()
      .when(state.license, {
        is: 'commercial',
        then: Yup.string()
          .trim()
          .required('License holder company is required'),
      }),
  });

  const {
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    errors,
  } = useFormik({
    initialValues: {
      licenseeName: '',
      licenseeSurname: '',
      licenseeCompany: '',
    },
    validationSchema,
    async onSubmit(values) {
      try {
        console.log(values);
      } catch (err) {
        console.log(err);
      }
    },
  });

  const modalBody = () => {
    return (
      <div className={classes.licenseContainer}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Card className={classes.card}>
            <Typography variant="h6" align="center">
              {`Add ${state.license} license`}
            </Typography>
            <CardContent>
              <TextField
                name="licenseeName"
                label="License holder name"
                type="text"
                value={values.licenseeName}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.licenseeName ? errors.licenseeName : ''}
                error={touched.licenseeName && Boolean(errors.licenseeName)}
                margin="dense"
                variant="outlined"
                fullWidth
              />
              <TextField
                name="licenseeSurname"
                label="License holder surname"
                type="text"
                value={values.licenseeSurname}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  touched.licenseeSurname ? errors.licenseeSurname : ''
                }
                error={
                  touched.licenseeSurname && Boolean(errors.licenseeSurname)
                }
                margin="dense"
                variant="outlined"
                fullWidth
              />
              {state.license === 'commercial' && (
                <TextField
                  name="licenseeCompany"
                  label="License holder company"
                  type="text"
                  value={values.licenseeCompany}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    touched.licenseeCompany ? errors.licenseeCompany : ''
                  }
                  error={
                    touched.licenseeCompany && Boolean(errors.licenseeCompany)
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                />
              )}
            </CardContent>
            <CardActions className={classes.actions}>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Save license
              </Button>
            </CardActions>
          </Card>
        </form>
      </div>
    );
  };

  const fetchArtwork = async () => {
    try {
      const { data } = await ax.get(`/api/artwork/${match.params.id}`);
      console.log(data.artwork);
      setState({ ...state, loading: false, artwork: data.artwork });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handleDownload = async (id) => {
    try {
      const { data } = await ax.get(`/api/artwork/${match.params.id}`);
      if (data.artwork._id)
        setState({ ...state, loading: false, artwork: data.artwork });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: true,
        body: modalBody(),
      },
    }));
  };

  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: false,
        body: ``,
      },
    }));
  };

  const handleLicenseChange = (value) => {
    setState({ ...state, license: value });
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <CircularProgress />
          </Grid>
        ) : state.artwork._id ? (
          <>
            <Grid item sm={12} md={7} className={classes.grid}>
              <Paper className={classes.paper}>
                <Card className={classes.root}>
                  <CardMedia
                    className={classes.cover}
                    image={state.artwork.current.cover}
                    title={state.artwork.current.title}
                  />
                </Card>
              </Paper>
              <br />
              <Paper className={classes.paper}>
                <Card className={classes.root}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Comments
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {state.artwork.comments.length ? (
                        <List className={classes.root}>
                          {state.artwork.comments.map((comment) => (
                            <React.Fragment key={comment._id}>
                              <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                  <Avatar
                                    alt={comment.owner.name}
                                    src={comment.owner.photo}
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography className={classes.fonts}>
                                      {comment.owner.name}
                                    </Typography>
                                  }
                                  secondary={<>{comment.content}</>}
                                />
                              </ListItem>
                              <Divider />
                            </React.Fragment>
                          ))}
                        </List>
                      ) : (
                        <p>No comments</p>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item sm={12} md={5} className={classes.grid}>
              <Paper className={classes.paper}>
                <Card className={classes.root}>
                  <CardMedia
                    className={classes.avatar}
                    image={state.artwork.owner.photo}
                    title={state.artwork.owner.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      <Anchor
                        component={Link}
                        to={`/user/${state.artwork.owner.name}`}
                      >
                        {state.artwork.owner.name}
                      </Anchor>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {state.artwork.owner.description ||
                        "This artist doesn't have much to say about themself"}
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
              <br />
              <Paper className={classes.paper}>
                <Card className={classes.root}>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {state.artwork.current.title}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {state.artwork.current.description}
                    </Typography>
                    {state.artwork.current.availability === 'available' ? (
                      <>
                        <Typography variant="body2" component="p">
                          Artwork price: $
                          {state.artwork.current.price || 'Free'}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Commercial license:
                          {state.artwork.current.commercial
                            ? ` $${state.artwork.current.commercial}`
                            : ' Free'}
                        </Typography>
                      </>
                    ) : null}
                    <Typography variant="body2" component="p">
                      {state.artwork.current.availability === 'available'
                        ? 'Total: '
                        : null}
                      {state.artwork.current.availability === 'available'
                        ? state.artwork.current.price
                          ? state.license === 'personal'
                            ? `$${state.artwork.current.price}`
                            : `$${
                                state.artwork.current.price +
                                state.artwork.current.commercial
                              }`
                          : state.license === 'personal'
                          ? 'Free'
                          : `$${state.artwork.current.commercial}`
                        : 'Showcase'}
                    </Typography>
                    {state.artwork.current.availability === 'available' ? (
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="artworkLicense">
                          License
                        </InputLabel>
                        <Select
                          label="License"
                          value={state.license}
                          onChange={(e) => handleLicenseChange(e.target.value)}
                          inputProps={{
                            id: 'artworkLicense',
                            name: 'artworkLicense',
                          }}
                        >
                          <MenuItem value="personal">Personal</MenuItem>
                          {state.artwork.current.license === 'commercial' ? (
                            <MenuItem value="commercial">Commercial</MenuItem>
                          ) : null}
                        </Select>
                      </FormControl>
                    ) : null}
                  </CardContent>
                  <CardActions>
                    {console.log(state.artwork.current, state.license)}
                    {state.artwork.owner._id !== store.user.id &&
                    state.artwork.current.availability === 'available' ? (
                      state.license === 'personal' ? (
                        state.artwork.current.price ? (
                          <Button onClick={() => handleModalOpen()}>
                            Add to cart
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              handleDownload(state.artwork.current._id)
                            }
                          >
                            Download
                          </Button>
                        )
                      ) : state.artwork.current.price ||
                        state.artwork.current.commercial ? (
                        <Button onClick={() => handleModalOpen()}>
                          Add to cart
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            handleDownload(state.artwork.current._id)
                          }
                        >
                          Download
                        </Button>
                      )
                    ) : null}
                    {state.artwork.owner._id === store.user.id ? (
                      <Button
                        component={Link}
                        to={`/edit_artwork/${state.artwork._id}`}
                      >
                        Edit artwork
                      </Button>
                    ) : null}
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          </>
        ) : (
          history.push('/')
        )}
        <Modal {...state.modal} handleClose={handleModalClose} />
      </Grid>
    </Container>
  );
};

export default ArtworkDetails;
