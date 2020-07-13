import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Store/Store.js';
import _ from 'lodash';
import {
  Grid,
  CircularProgress,
  Paper,
  Button,
  Icon,
  Typography,
  Input,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  TextField,
} from '@material-ui/core';
import * as Yup from 'yup';
import { Rating } from '@material-ui/lab';
import { useFormik, Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import { withRouter, useHistory } from 'react-router-dom';
import { ax } from '../../containers/Interceptor/Interceptor.js';
import { format } from 'date-fns';
import Modal from '../../shared/Modal/Modal.js';
import OrderStyles from './Order.style.js';
import { postReview, getOrder } from '../../services/orders.js';
import { reviewValidation } from '../../validation/review.js';

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
  const classes = OrderStyles();

  const history = useHistory();

  const modalBody = () => {
    // $TODO Refactor Formik to useFormik
    return (
      <div className={classes.reviewContainer}>
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
              <div>
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
              </div>
              <div>
                <Button type="submit" color="primary" fullWidth>
                  Publish
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  };

  const fetchOrders = async () => {
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
    fetchOrders();
  }, []);

  return (
    <>
      <div className="flex flex-1 w-full items-center justify-between">
        <div className="flex flex-1 flex-col items-center sm:items-start">
          <div className="flex flex-col min-w-0 items-center sm:items-start">
            <Typography className="text-16 sm:text-20 truncate">
              {`Order ID: ${state.order._id}`}
            </Typography>
          </div>
        </div>
      </div>
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
        <Tab className="h-64 normal-case" label="Invoice" />
      </Tabs>
      <div className="p-16 sm:p-24 max-w-2xl w-full">
        {/* Order Details */}
        {state.tab === 0 && (
          <div>
            <div className="pb-48">
              <div className="pb-16 flex items-center">
                <Typography className="h2 mx-16" color="textSecondary">
                  Customer
                </Typography>
              </div>

              <div className="mb-24">
                <div className="table-responsive mb-16">
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
                          <div className="flex items-center">
                            <Typography className="truncate mx-8">
                              {state.order.buyer.name}
                            </Typography>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {state.order.review ? (
              <div className="pb-48">
                <div className="pb-16 flex items-center">
                  <Typography className="h2 mx-16" color="textSecondary">
                    Review
                  </Typography>
                  <Typography className="h2 mx-16" color="textSecondary">
                    {state.order.review.rating}
                  </Typography>
                  <Typography className="h2 mx-16" color="textSecondary">
                    {state.order.review.content}
                  </Typography>
                </div>
              </div>
            ) : (
              <div className="pb-48">
                <div className="pb-16 flex items-center">
                  <Typography
                    onClick={handleModalOpen}
                    className="h2 mx-16"
                    color="textSecondary"
                  >
                    Leave a review
                  </Typography>
                </div>
              </div>
            )}

            <div className="pb-48">
              <div className="pb-16 flex items-center">
                <Typography className="h2 mx-16" color="textSecondary">
                  Artwork
                </Typography>
              </div>

              <div className="table-responsive">
                <table className="simple">
                  <thead>
                    <tr>
                      <th>Cover</th>
                      <th>Name</th>
                      <th>Artist</th>
                      <th>Licenses</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{state.order.version.cover}</td>
                      <td>{state.order.version.title}</td>
                      <td>{state.order.seller.name}</td>
                      <td>{state.order.licenses.length}</td>
                      <td>${state.order.spent}</td>
                      <td>{formatDate(state.order.created, 'dd/MM/yyyy')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pb-16 flex items-center">
                <Typography className="h2 mx-16" color="textSecondary">
                  Licenses
                </Typography>
              </div>

              <div className="table-responsive">
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
                    {state.order.licenses.map((license) => (
                      <tr key={license._id}>
                        <td>
                          <Typography className="truncate">
                            {license.fingerprint}
                          </Typography>
                        </td>
                        <td className="w-64 text-right">
                          <span className="truncate">{license.type}</span>
                        </td>
                        <td className="w-64 text-right">
                          <span className="truncate">{license.owner}</span>
                        </td>
                        <td className="w-64 text-right">
                          <span className="truncate">
                            {license.artwork.owner}
                          </span>
                        </td>
                        <td className="w-64 text-right">
                          <span className="truncate">${license.price}</span>
                        </td>
                        <td className="w-64 text-right">
                          <span className="truncate">
                            {formatDate(license.created, 'dd/MM/yyyy')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Invoice */}
        {/* {state.tab === 2 && <OrderInvoice order={order} />} */}
      </div>
      <Modal {...state.modal} handleClose={handleModalClose} />
    </>
  );
};

export default withRouter(Order);
