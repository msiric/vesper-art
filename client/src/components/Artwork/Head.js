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
    id: 'title',
    align: 'left',
    disablePadding: false,
    label: 'Title',
    sort: true,
  },
  {
    id: 'type',
    align: 'right',
    disablePadding: false,
    label: 'Type',
    sort: true,
  },
  {
    id: 'personal',
    align: 'right',
    disablePadding: false,
    label: 'Personal license',
    sort: true,
  },
  {
    id: 'commercial',
    align: 'right',
    disablePadding: false,
    label: 'Commercial license',
    sort: true,
  },
];

function ProductsTableHead({ artwork, handleRequestSort, rowCount }) {
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
              sortDirection={artwork.id === row.id ? artwork.direction : false}
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
                    active={artwork.id === row.id}
                    direction={artwork.direction}
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
