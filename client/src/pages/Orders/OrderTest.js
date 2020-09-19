import { Box, Button, Container, Grid, TextField } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { format } from 'date-fns';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import * as Yup from 'yup';
import ArtworkBar from '../../components/ArtworkBar/ArtworkBar.js';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.js';
import { Context } from '../../context/Store.js';
import { getOrder, postReview } from '../../services/orders.js';

const reviewValidation = Yup.object().shape({
  rating: Yup.number().min(1).max(5).required('Rating cannot be empty'),
  content: Yup.string().trim().required('Review cannot be empty'),
});

const Order = ({ match }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    loading: true,
    order: {},
    modal: {
      open: false,
      body: ``,
    },
  });
  const classes = {};

  const history = useHistory();

  const modalBody = () => {
    return (
      <Box className={classes.reviewContainer}>
        <Formik
          initialValues={{
            rating: 0,
            content: '',
          }}
          enableReinitialize
          validationSchema={reviewValidation}
          onSubmit={async (values, { resetForm }) => {
            await postReview({
              artworkId: state.order._id,
              reviewRating: values.rating,
              reviewContent: values.content,
            });
            setState((prevState) => ({
              ...prevState,
              order: {
                ...prevState.order,
                review: {
                  order: prevState.order._id,
                  artwork: prevState.order.artwork._id,
                  owner: store.user.id,
                  rating: values.rating,
                  content: values.content,
                },
              },
            }));
            handleModalClose();
            resetForm();
          }}
        >
          {({ values, errors, touched }) => (
            <Form className={classes.publishReview}>
              <Box>
                <Field name="rating">
                  {({
                    field,
                    form: { touched, errors, setFieldValue },
                    meta,
                  }) => <Rating {...field} />}
                </Field>
                <Field name="content">
                  {({ field, form: { touched, errors }, meta }) => (
                    <TextField
                      {...field}
                      onBlur={() => null}
                      label="Write your review"
                      type="text"
                      helperText={meta.touched && meta.error}
                      error={meta.touched && Boolean(meta.error)}
                      margin="dense"
                      variant="outlined"
                      multiline
                      fullWidth
                    />
                  )}
                </Field>
              </Box>
              <Box>
                <Button type="submit" color="primary" fullWidth>
                  Publish
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    );
  };

  const fetchOrder = async () => {
    try {
      const { data } = await getOrder({ orderId: match.params.id });
      setState({
        ...state,
        loading: false,
        tab: 0,
        order: data.order,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const handleChangeTab = (e, value) => {
    setState((prevState) => ({ ...prevState, tab: value }));
  };

  const handleModalOpen = (id) => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        open: true,
        body: modalBody(id),
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

  const formatDate = (date, type) => {
    return format(new Date(date), type);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <Container fixed className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <LoadingSpinner />
        ) : state.order._id ? (
          <>
            <Grid item xs={12} className={classes.artworkPreviewItem}>
              <ArtworkBar
                version={state.order.version}
                buyer={state.order.buyer}
                seller={state.order.seller}
              />
            </Grid>
            <Grid item xs={12} className={classes.artistSectionItem}></Grid>
          </>
        ) : (
          history.push('/')
        )}
      </Grid>
    </Container>
  );
};

export default withRouter(Order);
