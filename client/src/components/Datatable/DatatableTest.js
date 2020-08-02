import _ from 'lodash';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ProductsTableHead from './DatatableHeadTest';

function ProductsTable(props) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleClick(item) {
    props.history.push(`/apps/e-commerce/products/${item.id}/${item.handle}`);
  }

  function handleCheck(event, id) {
    const selectedId = props.selected[id];
    const newSelected = { ...props.selected, [id]: !selectedId };

    props.setSelected(newSelected);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  return (
    <div className="w-full flex flex-col">
      <Table className="min-w-xl" aria-labelledby="tableTitle">
        <ProductsTableHead
          numSelected={props.selected}
          order={order}
          onSelectAllClick={props.handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={props.data.length}
        />

        <TableBody>
          {_.orderBy(
            props.data,
            [
              (o) => {
                return o.current[order.id];
              },
            ],
            [order.direction]
          )
            .slice(
              props.page * rowsPerPage,
              props.page * rowsPerPage + rowsPerPage
            )
            .map((n) => {
              console.log(props.selected);
              const isSelected = props.selected[n._id];
              return (
                <TableRow
                  className="h-64 cursor-pointer"
                  hover
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  key={n._id}
                  selected={isSelected}
                  onClick={(event) => handleClick(n)}
                >
                  <TableCell className="w-64 text-center" padding="none">
                    <Checkbox
                      checked={isSelected}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => handleCheck(event, n._id)}
                    />
                  </TableCell>

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
            })}
        </TableBody>
      </Table>

      <TablePagination
        className="overflow-hidden"
        component="div"
        count={props.data.length}
        rowsPerPage={rowsPerPage}
        page={props.page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onChangePage={props.handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(ProductsTable);
