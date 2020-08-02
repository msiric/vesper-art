import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Paper, Button, Typography, Input } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withRouter, useHistory } from 'react-router-dom';
import Datatable from '../../components/Datatable/Datatable2.js';
import { getGallery } from '../../services/artwork.js';
import DatatableWrapper from '../../components/Datatable/DatatableWrapper.js';

function ProductsTable() {
  const [state, setState] = useState({
    loading: false,
    artwork: [],
    search: '',
    page: 0,
    limit: 10,
    sort: {
      direction: 'asc',
      id: null,
    },
    hasMore: true,
    dataCursor: 0,
    dataCeiling: 20,
  });

  const history = useHistory();

  const fetchArtwork = async () => {
    try {
      const { data } = await getGallery({
        dataCursor: state.dataCursor,
        dataCeiling: state.dataCeiling,
      });
      setState({
        ...state,
        loading: false,
        artwork: data.artwork,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchArtwork();
  }, []);

  useEffect(() => {
    if (state.search) {
      setState((prevState) => ({
        ...prevState,
        artwork: _.filter(prevState.artwork, (item) =>
          item.id.toLowerCase().includes(state.search.toLowerCase())
        ),
        page: 0,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        artwork: prevState.artwork,
      }));
    }
  }, [state.artwork, state.search]);

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
      limit: e.target.value,
    }));
  }

  const handleSearchChange = (e, value) => {
    setState((prevState) => ({
      ...prevState,
      search: value,
    }));
  };

  function handleRowClick(id) {
    history.push(`/artwork/${id}`);
  }

  return (
    <>
      <div className="flex flex-1 w-full items-center justify-between">
        <div className="flex items-center">
          <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
            My artwork
          </Typography>
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
        <Button
          component={Link}
          to="/add_artwork"
          variant="contained"
          color="secondary"
        >
          Add new artwork
        </Button>
      </div>
      <div className="w-full flex flex-col">
        {/* <Datatable
          rows={[
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
          ]}
          data={state.artwork}
          sort={state.sort}
          page={state.page}
          limit={state.limit}
          empty={'You have no artwork'}
          handleRequestSort={handleRequestSort}
          handleRowClick={handleRowClick}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
        {/* <DatatableWrapper /> */}
        <Datatable data={state.artwork} />
      </div>
    </>
  );
}

export default withRouter(ProductsTable);
