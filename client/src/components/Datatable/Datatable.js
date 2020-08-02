import _ from 'lodash';
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableHead,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const Datatable = ({
  rows,
  data,
  sort,
  page,
  limit,
  empty,
  handleRequestSort,
  handleRowClick,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const createSortHandler = (property) => (e) => {
    handleRequestSort(e, property);
  };

  return (
    <>
      <Table className="min-w-xl" aria-labelledby="tableTitle">
        <TableHead>
          <TableRow className="h-64">
            {data.length ? (
              rows.map((row) => {
                return (
                  <TableCell
                    key={row.id}
                    align={row.align}
                    padding={row.disablePadding ? 'none' : 'default'}
                    /*                   sortDirection={
                    artwork.id === row.id ? artwork.direction : false
                  } */
                  >
                    {row.sort && (
                      <Tooltip
                        title="Sort"
                        placement={
                          row.align === 'right' ? 'bottom-end' : 'bottom-start'
                        }
                        enterDelay={300}
                      >
                        <TableSortLabel
                          /*                         active={artwork.id === row.id}
                        direction={artwork.direction} */
                          onClick={createSortHandler(row.id)}
                        >
                          {row.label}
                        </TableSortLabel>
                      </Tooltip>
                    )}
                  </TableCell>
                );
              }, this)
            ) : (
              <TableCell padding={'default'}></TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? (
            data.map((n) => {
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

                  <TableCell component="th" scope="row" align="left">
                    {n.current.title}
                  </TableCell>

                  <TableCell component="th" scope="row" align="right">
                    {n.current.availability}
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
            })
          ) : (
            <TableRow tabIndex={-1}>
              <TableCell component="th" scope="row" align="center">
                {empty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        className="overflow-hidden"
        component="div"
        count={data.length}
        rowsPerPage={limit}
        page={page}
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

export default Datatable;
