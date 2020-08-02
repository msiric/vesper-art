import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

function ProductsHeader(props) {
  return (
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
            value={props.search}
            inputProps={{
              'aria-label': 'Search',
            }}
            onChange={(e) => {
              e.persist();
              props.setSearch(e.target.value);
            }}
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
  );
}

export default ProductsHeader;
