import _ from 'lodash';
import {
  Container,
  Grid,
  CircularProgress,
  Paper,
  Button,
  Link,
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
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import Datatable from '../../components/Datatable/Datatable.js';
import { getOrders } from '../../services/orders.js';
import { formatDate } from '../../../../common/helpers.js';

const Orders = () => {
  const [state, setState] = useState({
    loading: true,
    orders: [],
    display: 'purchases',
  });
  const classes = {};

  const history = useHistory();

  const fetchOrders = async () => {
    try {
      const { data } = await getOrders({ display: state.display });
      setState({
        ...state,
        loading: false,
        orders: data[state.display],
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [state.display]);

  const handleSelectChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      display: e.target.value,
    }));
  };

  function handleRowClick(id) {
    history.push(`/orders/${id}`);
  }

  console.log(state.orders);

  return (
    <Container fixed>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Datatable
            title="My orders"
            columns={[
              {
                name: 'Id',
                options: {
                  display: false,
                },
              },
              {
                name: 'Cover',
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => (
                    <img style={{ width: '85%', maxWidth: 200 }} src={value} />
                  ),
                },
              },
              'Title',
              state.display === 'purchases' ? 'Seller' : 'Buyer',
              'Amount',
              'Review',
              'Date',
            ]}
            data={state.orders.map((order) => [
              order._id,
              order.version.cover,
              order.version.title,
              state.display === 'purchases'
                ? order.seller.name
                : order.buyer.name,
              state.display === 'purchases'
                ? `$${order.spent}`
                : `$${order.earned}`,
              order.review ? order.review : 'No review left',
              formatDate(order.created, 'dd/MM/yy HH:mm'),
            ])}
            empty="You have no orders"
            loading={state.loading}
            redirect="orders"
            selectable={false}
            addOptions={{ enabled: false, title: '', route: '' }}
            editOptions={{
              enabled: false,
              title: '',
              route: '',
            }}
            deleteOptions={{
              enabled: false,
              title: '',
              route: '',
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default withRouter(Orders);
