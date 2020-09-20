import { Box, Button, Container, Grid } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { format } from 'date-fns';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import * as Yup from 'yup';
import LicenseCard from '../../components/LicenseCard/LicenseCard.js';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.js';
import OrderPreview from '../../components/OrderPreview/OrderPreview.js';
import ProfileCard from '../../components/ProfileCard/ProfileCard.js';
import ReviewCard from '../../components/ReviewCard/ReviewCard.js';
import { Context } from '../../context/Store.js';
import { getDownload, getOrder, postReview } from '../../services/orders.js';
import Modal from '../../shared/Modal/Modal.js';

const reviewValidation = Yup.object().shape({
  rating: Yup.number().min(1).max(5).required('Rating cannot be empty'),
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
          }}
          enableReinitialize
          validationSchema={reviewValidation}
          onSubmit={async (values, { resetForm }) => {
            await postReview({
              artworkId: state.order._id,
              reviewRating: values.rating,
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
                },
              },
            }));
            handleModalClose();
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

  const handleDownload = async () => {
    try {
      await getDownload({ orderId: match.params.id });
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (date, type) => {
    return format(new Date(date), type);
  };

  const isSeller = () =>
    store.user.id.toString() === state.order.seller._id.toString();

  const isBuyer = () =>
    store.user.id.toString() === state.order.buyer._id.toString();

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
              <OrderPreview
                version={state.order.version}
                handleDownload={handleDownload}
                shouldDownload={!isSeller() && isBuyer()}
              />
            </Grid>
            <Grid item xs={12} md={4} className={classes.artistSectionItem}>
              <ProfileCard
                user={
                  !isSeller() && isBuyer()
                    ? state.order.seller
                    : state.order.buyer
                }
              />
            </Grid>
            <Grid item xs={12} md={8} className={classes.artistSectionItem}>
              <LicenseCard license={state.order.license} />
              <ReviewCard
                handleModalOpen={handleModalOpen}
                review={state.order.review}
                shouldReview={!isSeller() && isBuyer()}
              />
            </Grid>
          </>
        ) : (
          history.push('/')
        )}
      </Grid>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </Container>
  );
};

export default withRouter(Order);
