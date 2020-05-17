import React, { useState } from 'react';
import {
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@material-ui/core';

const rows = [
  {
    id: 'cover',
    align: 'left',
    disablePadding: false,
    label: 'Cover',
    sort: true,
  },
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'Order ID',
    sort: true,
  },
  {
    id: 'title',
    align: 'right',
    disablePadding: false,
    label: 'Title',
    sort: true,
  },
  {
    id: 'user',
    align: 'right',
    disablePadding: false,
    label: 'User',
    sort: true,
  },
  {
    id: 'amount',
    align: 'right',
    disablePadding: false,
    label: 'Amount',
    sort: true,
  },
  {
    id: 'date',
    align: 'right',
    disablePadding: false,
    label: 'Date',
    sort: true,
  },
  {
    id: 'review',
    align: 'right',
    disablePadding: false,
    label: 'Review',
    sort: true,
  },
  {
    id: 'status',
    align: 'right',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

function ProductsTableHead({ order, handleRequestSort, rowCount }) {
  const [state, setState] = useState({
    selectedProductsMenu: null,
  });

  const createSortHandler = (property) => (e) => {
    handleRequestSort(e, property);
  };

  function openSelectedProductsMenu(e) {
    setState((prevState) => ({
      ...prevState,
      selectedProductsMenu: e.currentTarget,
    }));
  }

  function closeSelectedProductsMenu() {
    setState((prevState) => ({ ...prevState, selectedProductsMenu: null }));
  }

  return (
    <TableHead>
      <TableRow className="h-64">
        {rows.map((row) => {
          return (
            <TableCell
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={order.id === row.id ? order.direction : false}
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
                    active={order.id === row.id}
                    direction={order.direction}
                    onClick={createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default ProductsTableHead;
