import { Box, Button, Input, Paper } from "@material-ui/core";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import Datatable from "../../components/Datatable/Datatable.js";
import EmptySection from "../../components/EmptySection/EmptySection.js";
import { getGallery } from "../../services/artwork.js";

const MyArtwork = () => {
  const [state, setState] = useState({
    loading: false,
    artwork: [],
    search: "",
    page: 0,
    rows: 10,
    sort: {
      direction: "asc",
      id: null,
    },
  });

  const history = useHistory();

  const fetchArtwork = async () => {
    try {
      const { data } = await getGallery.request();
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
    let direction = "desc";

    if (state.sort.id === property && state.sort.direction === "desc") {
      direction = "asc";
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
    history.push(`/artwork/${id}`);
  }

  return (
    <>
      <Box className="flex flex-1 w-full items-center justify-between">
        <Box className="flex items-center">
          <MainHeading text="My artwork" />
        </Box>

        <Box className="flex flex-1 items-center justify-center px-12">
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
                "aria-label": "Search",
              }}
              onChange={(e) => handleSearchChange(e)}
            />
          </Paper>
        </Box>
        <Button
          component={Link}
          to="/add_artwork"
          variant="outlined"
          color="secondary"
        >
          Add new artwork
        </Button>
      </Box>
      <Box className="w-full flex flex-col">
        <Datatable
          data={state.artwork}
          sort={state.sort}
          page={state.page}
          rows={state.rows}
          empty={
            <EmptySection label="License not found" loading={state.loading} />
          }
          loading={state.loading}
          searchable={true}
          pagination={true}
          handleRequestSort={handleRequestSort}
          handleRowClick={handleRowClick}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
};

export default withRouter(MyArtwork);
