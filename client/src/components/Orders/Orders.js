import _ from 'lodash';
import {
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
import ax from '../../axios.config';
import { format } from 'date-fns';
import ProductsTableHead from './Head';
import OrdersStyles from './Orders.style';

const Orders = () => {
  const [state, setState] = useState({
    loading: true,
    orders: [],
    search: '',
    display: 'purchases',
    page: 0,
    rows: 10,
    sort: {
      direction: 'asc',
      id: null,
    },
  });
  const classes = OrdersStyles();

  const history = useHistory();

  const fetchOrders = async () => {
    try {
      const { data } = await ax.get(`/api/orders/${state.display}`);
      console.log(data);
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

  useEffect(() => {
    if (state.search) {
      setState((prevState) => ({
        ...prevState,
        orders: _.filter(prevState.orders, (item) =>
          item.id.toLowerCase().includes(state.search.toLowerCase())
        ),
        page: 0,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        orders: prevState.orders,
      }));
    }
  }, [state.orders, state.search]);

  function handleRequestSort(e, property) {
    const id = property;
    let direction = 'desc';

    if (state.sort.id === property && state.sort.direction === 'desc') {
      direction = 'asc';
    }

    setState((prevState) => ({
      ...prevState,
      sort: {
        direction: direction,
        id: id,
      },
    }));
  }

  function handleChangePage(e, value) {
    setState((prevState) => ({
      ...prevState,
      page: value,
    }));
  }

  function handleChangeRowsPerPage(e) {
    setState((prevState) => ({
      ...prevState,
      rows: e.target.value,
    }));
  }

  const handleSearchChange = (e, value) => {
    setState((prevState) => ({
      ...prevState,
      search: value,
    }));
  };

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
    <Grid container className={classes.container}>
      <Grid item xs={12} className={classes.grid}>
        {state.loading ? (
          <CircularProgress />
        ) : (
          <>
            <div className="flex flex-1 w-full items-center justify-between">
              <div className="flex items-center">
                <Typography
                  className="hidden sm:flex mx-0 sm:mx-12 capitalize"
                  variant="h6"
                >
                  {state.display}
                </Typography>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="data-display">Displayed data</InputLabel>
                  <Select
                    labelId="data-display"
                    value={state.display}
                    onChange={handleSelectChange}
                    label="Displayed data"
                    margin="dense"
                  >
                    <MenuItem value="purchases">Purchases</MenuItem>
                    <MenuItem value="sales">Sales</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="flex flex-1 items-center justify-center px-12">
                <Paper
                  className="flex items-center w-full max-w-512 px-8 py-4 rounded-8"
                  elevation={1}
                >
                  <Input
                    placeholder="Search"
                    className="flex flex-1 mx-8"
                    disableUnderline
                    fullWidth
                    value={state.search}
                    inputProps={{
                      'aria-label': 'Search',
                    }}
                    onChange={(e) => handleSearchChange(e)}
                  />
                </Paper>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <Table className="min-w-xl" aria-labelledby="tableTitle">
                <ProductsTableHead
                  order={state.sort}
                  handleRequestSort={handleRequestSort}
                  rowCount={state.orders.length}
                />

                <TableBody>
                  {_.orderBy(
                    state.orders,
                    [
                      (o) => {
                        switch (state.sort.id) {
                          case 'categories': {
                            return o.categories[0];
                          }
                          default: {
                            return o[state.sort.id];
                          }
                        }
                      },
                    ],
                    [state.sort.direction]
                  )
                    .slice(
                      state.page * state.rows,
                      state.page * state.rows + state.rows
                    )
                    .map((n) => {
                      return (
                        <TableRow
                          className="h-64 cursor-pointer"
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={n.id}
                          onClick={(e) => handleRowClick(n.id)}
                        >
                          <TableCell component="th" scope="row" align="left">
                            <img src={n.version.cover} alt={n.name} />
                          </TableCell>

                          <TableCell component="th" scope="row">
                            {n.id}
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            {n.version.title}
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            {state.display === 'purchases'
                              ? n.seller.name
                              : n.buyer.name}
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            {state.display === 'purchases'
                              ? `$${n.spent}`
                              : `$${n.earned}`}
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            {format(new Date(n.created), 'dd/MM/yyyy')}
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            {n.review ? n.review.rating : 'Not rated'}
                          </TableCell>

                          <TableCell component="th" scope="row" align="right">
                            {n.status}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <TablePagination
                className="overflow-hidden"
                component="div"
                count={state.orders.length}
                rowsPerPage={state.rows}
                page={state.page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default withRouter(Orders);
