import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import React, { useState } from 'react';

/* const rows = [
  {
    id: 'image',
    align: 'left',
    disablePadding: true,
    label: '',
    sort: false,
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'categories',
    align: 'left',
    disablePadding: false,
    label: 'Category',
    sort: true,
  },
  {
    id: 'priceTaxIncl',
    align: 'right',
    disablePadding: false,
    label: 'Price',
    sort: true,
  },
  {
    id: 'quantity',
    align: 'right',
    disablePadding: false,
    label: 'Quantity',
    sort: true,
  },
  {
    id: 'active',
    align: 'right',
    disablePadding: false,
    label: 'Active',
    sort: true,
  },
]; */

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
    id: 'availability',
    align: 'right',
    disablePadding: false,
    label: 'Availability',
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

const useStyles = makeStyles((theme) => ({
  actionsButtonWrapper: {
    background: theme.palette.background.paper,
  },
}));

function ProductsTableHead(props) {
  const classes = useStyles(props);
  const [selectedProductsMenu, setSelectedProductsMenu] = useState(null);
  const [selectedLength, setSelectedLength] = useState(
    Object.keys(props.numSelected).length
  );

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedProductsMenu(event) {
    setSelectedProductsMenu(event.currentTarget);
  }

  function closeSelectedProductsMenu() {
    setSelectedProductsMenu(null);
  }
  return (
    <TableHead>
      <TableRow className="h-64">
        <TableCell padding="none" className="relative w-64 text-center">
          <Checkbox
            indeterminate={
              selectedLength > 0 && selectedLength < props.rowCount
            }
            checked={selectedLength === props.rowCount}
            onChange={props.onSelectAllClick}
          />
          {selectedLength > 0 && (
            <div
              className={
                'flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10'
              }
            >
              <IconButton
                aria-owns={selectedProductsMenu ? 'selectedProductsMenu' : null}
                aria-haspopup="true"
                onClick={openSelectedProductsMenu}
              >
                <Icon>more_horiz</Icon>
              </IconButton>
              <Menu
                id="selectedProductsMenu"
                anchorEl={selectedProductsMenu}
                open={Boolean(selectedProductsMenu)}
                onClose={closeSelectedProductsMenu}
              >
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      closeSelectedProductsMenu();
                    }}
                  >
                    <ListItemIcon className="min-w-40">
                      <Icon>delete</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Remove" />
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          )}
        </TableCell>
        {rows.map((row) => {
          return (
            <TableCell
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'default'}
              sortDirection={
                props.order.id === row.id ? props.order.direction : false
              }
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
                    active={props.order.id === row.id}
                    direction={props.order.direction}
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