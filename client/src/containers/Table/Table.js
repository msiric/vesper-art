import _ from 'lodash';
import {
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
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { ax } from '../../containers/Interceptor/Interceptor.js';
import ProductsTableHead from './Head.js';
import { getGallery } from '../../services/artwork.js';

const ProductsTable = () => {
  return (
    <>
      <Table className="min-w-xl" aria-labelledby="tableTitle">
        <ProductsTableHead
          artwork={state.sort}
          handleRequestSort={handleRequestSort}
          rowCount={state.artwork.length}
        />

        <TableBody>
          {_.orderBy(
            state.artwork,
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
                  className="h-64 dataCursor-pointer"
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={n.id}
                  onClick={(e) => handleRowClick(n._id)}
                >
                  <TableCell component="th" scope="row" align="left">
                    <img src={n.current.cover} alt={n.name} />
                  </TableCell>

                  <TableCell component="th" scope="row" align="right">
                    {n.current.title}
                  </TableCell>

                  <TableCell component="th" scope="row" align="right">
                    {n.current.type}
                  </TableCell>

                  <TableCell component="th" scope="row" align="right">
                    ${n.current.personal}
                  </TableCell>

                  <TableCell component="th" scope="row" align="right">
                    ${n.current.commercial}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <TablePagination
        className="overflow-hidden"
        component="div"
        count={state.artwork.length}
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
    </>
  );
};

export default ProductsTable;
