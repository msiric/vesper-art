import _ from 'lodash';
import {
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
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import ProductsTableHead from './Head';

function ProductsTable() {
  const [state, setState] = useState({
    loading: false,
    orders: [{ id: 1, price: 15, date: Date.now(), review: 4.5 }],
    search: '',
    page: 0,
    rows: 10,
    sort: {
      direction: 'asc',
      id: null,
    },
  });

  const history = useHistory();

  useEffect(() => {
    //get data
  }, []);

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

  function handleRowClick(id) {
    history.push(`/orders/${id}`);
  }

  return (
    <>
      <div className="flex flex-1 w-full items-center justify-between">
        <div className="flex items-center">
          <Icon className="text-32">shopping_basket</Icon>
          <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
            Products
          </Typography>
        </div>

        <div className="flex flex-1 items-center justify-center px-12">
          <Paper
            className="flex items-center w-full max-w-512 px-8 py-4 rounded-8"
            elevation={1}
          >
            <Icon color="action">search</Icon>

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
        <Button
          component={Link}
          to="/apps/e-commerce/products/new"
          className="whitespace-no-wrap normal-case"
          variant="contained"
          color="secondary"
        >
          <span className="hidden sm:flex">Add New Product</span>
          <span className="flex sm:hidden">New</span>
        </Button>
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
                    <TableCell component="th" scope="row">
                      {n.id}
                    </TableCell>

                    <TableCell component="th" scope="row" align="right">
                      {n.price}
                    </TableCell>

                    <TableCell component="th" scope="row" align="right">
                      {n.date}
                    </TableCell>

                    <TableCell component="th" scope="row" align="right">
                      {n.review}
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
  );
}

export default withRouter(ProductsTable);
