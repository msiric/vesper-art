import { Container, Grid } from '@material-ui/core';
import { parse } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { formatDate } from '../../../../common/helpers.js';
import Datatable from '../../components/Datatable/Datatable.js';
import { getOrders } from '../../services/orders.js';

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
                name: 'Artwork',
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => (
                    <img style={{ width: '85%', maxWidth: 200 }} src={value} />
                  ),
                  sort: false,
                },
              },
              {
                name: 'Title',
              },
              state.display === 'purchases' ? 'Seller' : 'Buyer',
              {
                name: 'Amount',
                options: {
                  sortCompare: (order) => {
                    return (obj1, obj2) => {
                      const val1 = obj1.data.split('$')[1]
                        ? obj1.data.split('$')[1] * 100
                        : 0;
                      const val2 = obj2.data.split('$')[1]
                        ? obj2.data.split('$')[1] * 100
                        : 0;
                      return (
                        (val1 - val2 ? -1 : 1) * (order === 'asc' ? 1 : -1)
                      );
                    };
                  },
                },
              },
              {
                name: 'Rating',
                options: {
                  sortCompare: (order) => {
                    return (obj1, obj2) => {
                      const val1 =
                        typeof obj1.data === 'string' ? 0 : obj1.data;
                      const val2 =
                        typeof obj2.data === 'string' ? 0 : obj2.data;
                      return (val1 - val2) * (order === 'asc' ? 1 : -1);
                    };
                  },
                },
              },
              {
                name: 'Date',
                options: {
                  sortCompare: (order) => {
                    return (obj1, obj2) => {
                      const val1 = parse(
                        obj1.data,
                        'dd/MM/yy HH:mm',
                        Date.now()
                      );
                      const val2 = parse(
                        obj2.data,
                        'dd/MM/yy HH:mm',
                        Date.now()
                      );
                      return (
                        (val1.getTime() - val2.getTime()) *
                        (order === 'asc' ? 1 : -1)
                      );
                    };
                  },
                },
              },
              ,
            ]}
            data={state.orders.map((order) => [
              order._id,
              order.version.cover,
              order.version.title,
              state.display === 'purchases'
                ? order.seller.name
                : order.buyer.name,
              state.display === 'purchases'
                ? order.spent
                  ? `$${order.spent}`
                  : 'Free'
                : order.earned
                ? `$${order.earned}`
                : 'Free',
              order.review ? order.review.rating : 'No rating left',
              formatDate(order.created, 'dd/MM/yy HH:mm'),
            ])}
            empty="You have no orders"
            loading={state.loading}
            redirect="orders"
            selectable={false}
            searchable={true}
            pagination={true}
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
