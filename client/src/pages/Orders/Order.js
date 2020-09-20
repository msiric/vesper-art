import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { format } from 'date-fns';
import { Field, Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import * as Yup from 'yup';
import { Context } from '../../context/Store.js';
import { getOrder, postReview } from '../../services/orders.js';
import Modal from '../../shared/Modal/Modal.js';

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
    <Container fixed>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Box className="flex flex-1 w-full items-center justify-between">
            <Box className="flex flex-1 flex-col items-center sm:items-start">
              <Box className="flex flex-col min-w-0 items-center sm:items-start">
                <Typography className="text-16 sm:text-20 truncate">
                  {`Order ID: ${state.order._id}`}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Tabs
            value={state.tab}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: 'w-full h-64' }}
          >
            <Tab className="h-64 normal-case" label="Details" />
            {state.order.commercial && (
              <Tab className="h-64 normal-case" label="Invoice" />
            )}
          </Tabs>
          <Box className="p-16 sm:p-24 max-w-2xl w-full">
            {/* Order Details */}
            {state.tab === 0 && (
              <Box>
                <Box className="pb-48">
                  <Box className="pb-16 flex items-center">
                    <Typography className="h2 mx-16" color="textSecondary">
                      Customer
                    </Typography>
                  </Box>

                  <Box className="mb-24">
                    <Box className="table-responsive mb-16">
                      <table className="simple">
                        <thead>
                          <tr>
                            <th>Photo</th>
                            <th>Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <Avatar src={state.order.buyer.photo} />
                            </td>
                            <td>
                              <Box className="flex items-center">
                                <Typography className="truncate mx-8">
                                  {state.order.buyer.name}
                                </Typography>
                              </Box>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </Box>
                </Box>

                {state.order.review ? (
                  <Box className="pb-48">
                    <Box className="pb-16 flex items-center">
                      <Typography className="h2 mx-16" color="textSecondary">
                        Review
                      </Typography>
                      <Typography className="h2 mx-16" color="textSecondary">
                        {state.order.review.rating}
                      </Typography>
                      <Typography className="h2 mx-16" color="textSecondary">
                        {state.order.review.content}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box className="pb-48">
                    <Box className="pb-16 flex items-center">
                      <Typography
                        onClick={handleModalOpen}
                        className="h2 mx-16"
                        color="textSecondary"
                      >
                        Leave a review
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box className="pb-48">
                  <Box className="pb-16 flex items-center">
                    <Typography className="h2 mx-16" color="textSecondary">
                      Artwork
                    </Typography>
                  </Box>

                  <Box className="table-responsive">
                    <table className="simple">
                      <thead>
                        <tr>
                          <th>Cover</th>
                          <th>Name</th>
                          <th>Artist</th>
                          <th>License</th>
                          <th>Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{state.order.version.cover}</td>
                          <td>{state.order.version.title}</td>
                          <td>{state.order.seller.name}</td>
                          <td>{state.order.license.type}</td>
                          <td>${state.order.spent}</td>
                          <td>
                            {formatDate(state.order.created, 'dd/MM/yyyy')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>

                  <Box className="pb-16 flex items-center">
                    <Typography className="h2 mx-16" color="textSecondary">
                      License
                    </Typography>
                  </Box>

                  <Box className="table-responsive">
                    <table className="simple">
                      <thead>
                        <tr>
                          <th>Fingerprint</th>
                          <th>Type</th>
                          <th>Buyer ID</th>
                          <th>Seller ID</th>
                          <th>Price</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr key={state.order.license._id}>
                          <td>
                            <Typography className="truncate">
                              {state.order.license.fingerprint}
                            </Typography>
                          </td>
                          <td className="w-64 text-right">
                            <span className="truncate">
                              {state.order.license.type}
                            </span>
                          </td>
                          <td className="w-64 text-right">
                            <span className="truncate">
                              {state.order.license.owner}
                            </span>
                          </td>
                          <td className="w-64 text-right">
                            <span className="truncate">
                              {state.order.license.artwork.owner}
                            </span>
                          </td>
                          <td className="w-64 text-right">
                            <span className="truncate">
                              ${state.order.license.price}
                            </span>
                          </td>
                          <td className="w-64 text-right">
                            <span className="truncate">
                              {formatDate(
                                state.order.license.created,
                                'dd/MM/yyyy'
                              )}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Box>
                </Box>
              </Box>
            )}
            {/* Invoice */}
            {/* {state.tab === 2 && <OrderInvoice order={order} />} */}
          </Box>
          <Modal {...state.modal} handleClose={handleModalClose} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default withRouter(Order);
