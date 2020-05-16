import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../Store/Store';
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
import ax from '../../axios.config';
import { format } from 'date-fns';
import Modal from '../../shared/Modal/Modal';
import OrderStyles from './Order.style';

const reviewValidation = Yup.object().shape({
  rating: Yup.number().min(1).max(5).required('Rating cannot be empty'),
  content: Yup.string().trim().required('Revieww cannot be empty'),
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
  const classes = OrderStyles();

  const history = useHistory();

  const modalBody = () => {
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
            await ax.post(`/api/rate_artwork/${state.order._id}`, {
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
      const { data } = await ax.get(`/api/orders/${match.params.id}`);
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
        <Tab className="h-64 normal-case" label="Order details" />
        <Tab className="h-64 normal-case" label="Licenses" />
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
                        <th>Email</th>
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
                        <td>
                          <Typography className="truncate">
                            {state.order.buyer.email}
                          </Typography>
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
                  Artwork details
                </Typography>
              </div>

              <div className="table-responsive">
                <table className="simple">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Updated On</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>A</td>
                      <td>B</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pb-48">
              <div className="pb-16 flex items-center">
                <Typography className="h2 mx-16" color="textSecondary">
                  Payment
                </Typography>
              </div>

              <div className="table-responsive">
                <table className="simple">
                  <thead>
                    <tr>
                      <th>Payment Method</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="truncate">Credit card</span>
                      </td>
                      <td>
                        <span className="truncate">{state.order.earned}</span>
                      </td>
                      <td>
                        <span className="truncate">{state.order.created}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Products */}
        {state.tab === 1 && (
          <div className="table-responsive">
            <table className="simple">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {state.order.licenses.map((license) => (
                  <tr key={license._id}>
                    <td className="w-64">{license._id}</td>
                    <td>
                      <Typography
                        component={Link}
                        to={`/apps/e-commerce/products/${license._id}`}
                        className="truncate"
                        style={{
                          color: 'inherit',
                          textDecoration: 'underline',
                        }}
                      >
                        {license.credentials}
                      </Typography>
                    </td>
                    <td className="w-64 text-right">
                      <span className="truncate">${license.price}</span>
                    </td>
                    <td className="w-64 text-right">
                      <span className="truncate">1</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
