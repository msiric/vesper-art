import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/Store';
import SelectInput from '../../shared/SelectInput/SelectInput';
import { useFormik, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
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
} from '@material-ui/icons';
import { Link, useHistory } from 'react-router-dom';
import ax from '../../axios.config';
import ArtworkDetailsStyles from './ArtworkDetails.style';

const commentValidation = Yup.object().shape({
  commentContent: Yup.string().trim().required('Comment cannot be empty'),
});

const licenseValidation = Yup.object().shape({
  licenseType: Yup.string()
    .matches(/(personal|commercial)/)
    .required('License type is required'),
});

const ArtworkDetails = ({ match }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    artwork: {},
    license: 'personal',
    modal: {
      open: false,
    },
    popover: {
      id: null,
      anchorEl: null,
      open: false,
    },
    edits: {},
  });
  const history = useHistory();

  const classes = ArtworkDetailsStyles();

  const {
    isSubmitting,
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
      licenseType: state.license,
    },
    validationSchema: licenseValidation,
    async onSubmit(values) {
      try {
        // $CART
        // await ax.post(`/api/cart/artwork/${match.params.id}`, values);
        // handleModalClose();
        // dispatch({
        //   type: 'updateCart',
        //   cart: { ...store.user.cart, [state.artwork._id]: true },
        //   cartSize: store.user.cartSize + 1,
        // });

        history.push({
          pathname: `/checkout/${match.params.id}`,
          state: { payload: values },
        });
      } catch (err) {
        console.log(err);
      }
    },
  });

  const fetchArtwork = async () => {
    try {
      const { data } = await ax.get(`/api/artwork/${match.params.id}`);
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

  const handleLicenseChange = (value) => {
    setState({ ...state, license: value });
  };

  const handlePopoverOpen = (e, id) => {
    setState((prevState) => ({
      ...prevState,
      popover: {
        id: id,
        anchorEl: e.currentTarget,
        open: true,
      },
    }));
  };

  const handlePopoverClose = (e) => {
    setState((prevState) => ({
      ...prevState,
      popover: {
        id: null,
        anchorEl: null,
        open: false,
      },
    }));
  };

  const handleCommentOpen = (id) => {
    setState((prevState) => ({
      ...prevState,
      edits: { ...prevState.edits, [id]: true },
      popover: {
        id: null,
        anchorEl: null,
        open: false,
      },
    }));
  };

  const handleCommentClose = (id) => {
    setState((prevState) => ({
      ...prevState,
      edits: { ...prevState.edits, [id]: false },
    }));
  };

  const handleCommentDelete = async (id) => {
    await ax.delete(`/api/artwork/${match.params.id}/comment/${id}`);
    setState((prevState) => ({
      ...prevState,
      artwork: {
        ...prevState.artwork,
        comments: prevState.artwork.comments.filter(
          (comment) => comment._id !== id
        ),
      },
      popover: {
        id: null,
        anchorEl: null,
        open: false,
      },
    }));
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
                                    component={Link}
                                    to={`/user/${comment.owner.name}`}
                                    className={classes.noLink}
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    state.edits[comment._id] ? null : (
                                      <Typography
                                        component={Link}
                                        to={`/user/${comment.owner.name}`}
                                        className={`${classes.fonts} ${classes.noLink}`}
                                      >
                                        {comment.owner.name}
                                      </Typography>
                                    )
                                  }
                                  secondary={
                                    state.edits[comment._id] ? (
                                      <Formik
                                        initialValues={{
                                          commentContent: comment.content,
                                        }}
                                        enableReinitialize
                                        validationSchema={commentValidation}
                                        onSubmit={async (
                                          values,
                                          { resetForm }
                                        ) => {
                                          const { data } = await ax.patch(
                                            `/api/artwork/${state.artwork._id}/comment/${comment._id}`,
                                            values
                                          );
                                          const index = state.artwork.comments.findIndex(
                                            (item) => item._id === comment._id
                                          );
                                          if (index !== -1) {
                                            setState((prevState) => ({
                                              ...prevState,
                                              artwork: {
                                                ...prevState.artwork,
                                                comments: [
                                                  ...prevState.artwork.comments.slice(
                                                    0,
                                                    index
                                                  ),
                                                  {
                                                    ...prevState.artwork
                                                      .comments[index],
                                                    content:
                                                      values.commentContent,
                                                    modified: true,
                                                  },
                                                  ...prevState.artwork.comments.slice(
                                                    index + 1
                                                  ),
                                                ],
                                              },
                                              edits: {
                                                ...prevState.edits,
                                                [comment._id]: false,
                                              },
                                            }));
                                          }
                                          resetForm();
                                        }}
                                      >
                                        {({ values, errors, touched }) => (
                                          <Form className={classes.editComment}>
                                            <div
                                              className={
                                                classes.editCommentForm
                                              }
                                            >
                                              <Field name="commentContent">
                                                {({
                                                  field,
                                                  form: { touched, errors },
                                                  meta,
                                                }) => (
                                                  <TextField
                                                    {...field}
                                                    onBlur={() => null}
                                                    label="Edit comment"
                                                    type="text"
                                                    helperText={
                                                      meta.touched && meta.error
                                                    }
                                                    error={
                                                      meta.touched &&
                                                      Boolean(meta.error)
                                                    }
                                                    margin="dense"
                                                    variant="outlined"
                                                    fullWidth
                                                    multiline
                                                  />
                                                )}
                                              </Field>
                                            </div>
                                            <div
                                              className={
                                                classes.editCommentActions
                                              }
                                            >
                                              <Button
                                                type="button"
                                                color="primary"
                                                onClick={() =>
                                                  handleCommentClose(
                                                    comment._id
                                                  )
                                                }
                                                fullWidth
                                              >
                                                Cancel
                                              </Button>
                                              <Button
                                                type="submit"
                                                color="primary"
                                                fullWidth
                                              >
                                                Save
                                              </Button>
                                            </div>
                                          </Form>
                                        )}
                                      </Formik>
                                    ) : (
                                      <Typography>{comment.content}</Typography>
                                    )
                                  }
                                />
                                {state.edits[comment._id] ||
                                comment.owner._id !== store.user.id ? null : (
                                  <ListItemSecondaryAction>
                                    <IconButton
                                      onClick={(e) =>
                                        handlePopoverOpen(e, comment._id)
                                      }
                                      edge="end"
                                      aria-label="More"
                                    >
                                      <MoreIcon />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                )}
                              </ListItem>
                              <Divider />
                            </React.Fragment>
                          ))}
                        </List>
                      ) : (
                        <p>No comments</p>
                      )}
                      <Formik
                        initialValues={{
                          commentContent: '',
                        }}
                        validationSchema={commentValidation}
                        onSubmit={async (values, { resetForm }) => {
                          const { data } = await ax.post(
                            `/api/artwork/${state.artwork._id}/comment`,
                            values
                          );
                          setState({
                            ...state,
                            artwork: {
                              ...state.artwork,
                              comments: [
                                ...state.artwork.comments,
                                {
                                  ...data.payload,
                                  owner: {
                                    _id: store.user.id,
                                    name: store.user.name,
                                    photo: store.user.photo,
                                  },
                                },
                              ],
                            },
                          });
                          resetForm();
                        }}
                      >
                        {({ values, errors, touched }) => (
                          <Form className={classes.postComment}>
                            <Field name="commentContent">
                              {({ field, form: { touched, errors }, meta }) => (
                                <TextField
                                  {...field}
                                  onBlur={() => null}
                                  label="Type a comment"
                                  type="text"
                                  helperText={meta.touched && meta.error}
                                  error={meta.touched && Boolean(meta.error)}
                                  margin="dense"
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                />
                              )}
                            </Field>
                            <Button type="submit" color="primary" fullWidth>
                              Post
                            </Button>
                          </Form>
                        )}
                      </Formik>
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item sm={12} md={5} className={classes.grid}>
              <Paper className={classes.paper}>
                <Card className={classes.user}>
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
                          Artwork price:
                          {state.artwork.current.personal
                            ? ` $${state.artwork.current.personal}`
                            : ' Free'}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Commercial license:
                          {state.artwork.current.commercial
                            ? ` $${state.artwork.current.commercial}`
                            : state.artwork.current.personal
                            ? ` $${state.artwork.current.personal}`
                            : ' Free'}
                        </Typography>
                      </>
                    ) : null}
                    {/* $CART */}
                    {/*                     {state.artwork.current.availability === 'available' &&
                    !store.user.cart[state.artwork._id] ? (
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
                    ) : null} */}
                  </CardContent>
                  <CardActions>
                    {state.artwork.owner._id !== store.user.id &&
                    state.artwork.current.availability === 'available' ? (
                      state.license === 'personal' ? (
                        state.artwork.current.personal ? (
                          store.user.cart[state.artwork._id] ? (
                            <Button component={Link} to={'/cart/'}>
                              In cart
                            </Button>
                          ) : (
                            <Button
                              component={Link}
                              to={`/checkout/${match.params.id}`}
                            >
                              Continue
                            </Button>
                          )
                        ) : (
                          <Button
                            onClick={() =>
                              handleDownload(state.artwork.current._id)
                            }
                          >
                            Download
                          </Button>
                        )
                      ) : state.artwork.current.personal ||
                        state.artwork.current.commercial ? (
                        <Button
                          component={Link}
                          to={`/checkout/${match.params.id}`}
                        >
                          Continue
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
        <div>
          <Modal
            open={state.modal.open}
            onClose={handleModalClose}
            aria-labelledby="License modal"
            className={classes.modal}
          >
            <form className={classes.licenseForm} onSubmit={handleSubmit}>
              <div className={classes.licenseContainer}>
                <Card className={classes.card}>
                  <Typography variant="h6" align="center">
                    {`Add ${state.license} license`}
                  </Typography>
                  <CardContent>
                    <SelectInput
                      name="licenseType"
                      label="License type"
                      value={values.licenseType}
                      className={classes.license}
                      disabled
                      options={[
                        {
                          value: state.license,
                          text: state.license,
                        },
                      ]}
                    />
                  </CardContent>
                  <CardActions className={classes.actions}>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Continue
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
      <Popover
        open={state.popover.open}
        anchorEl={state.popover.anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transition
      >
        <div className={classes.moreOptions}>
          <Button
            variant="contained"
            color="error"
            className={classes.button}
            startIcon={<EditIcon />}
            onClick={() => handleCommentOpen(state.popover.id)}
            fullWidth
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={() => handleCommentDelete(state.popover.id)}
            fullWidth
          >
            Delete
          </Button>
        </div>
      </Popover>
    </Container>
  );
};

export default ArtworkDetails;
