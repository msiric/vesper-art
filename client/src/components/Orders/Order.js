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
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import ax from '../../axios.config';
import { format } from 'date-fns';
import OrderStyles from './Order.style';

const Orders = ({ match }) => {
  const [state, setState] = useState({
    loading: true,
    order: {},
  });
  const classes = OrderStyles();

  const history = useHistory();

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

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <div className="flex flex-1 w-full items-center justify-between">
        <div className="flex flex-1 flex-col items-center sm:items-start">
          <Typography
            className="normal-case flex items-center sm:mb-12"
            component={Link}
            role="button"
            to="/orders"
            color="inherit"
          >
            <Icon className="text-20">arrow_back</Icon>
            <span className="mx-4">Orders</span>
          </Typography>

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
        <Tab className="h-64 normal-case" label="Order Details" />
        <Tab className="h-64 normal-case" label="Products" />
        <Tab className="h-64 normal-case" label="Invoice" />
      </Tabs>
      <div className="p-16 sm:p-24 max-w-2xl w-full">
        {/* Order Details */}
        {state.tab === 0 && (
          <div>
            <div className="pb-48">
              <div className="pb-16 flex items-center">
                <Icon color="action">account_circle</Icon>
                <Typography className="h2 mx-16" color="textSecondary">
                  Customer
                </Typography>
              </div>

              <div className="mb-24">
                <div className="table-responsive mb-16">
                  <table className="simple">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="flex items-center">
                            <Avatar src={state.order.buyer.photo} />
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

            <div className="pb-48">
              <div className="pb-16 flex items-center">
                <Icon color="action">access_time</Icon>
                <Typography className="h2 mx-16" color="textSecondary">
                  Order Status
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
                <Icon color="action">attach_money</Icon>
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
    </>
  );
};

export default withRouter(Orders);
