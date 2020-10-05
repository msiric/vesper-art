import { Box, Container, Grid, IconButton } from "@material-ui/core";
import {
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
import Datatable from "../../components/Datatable/Datatable.js";
import { deleteArtwork, getGallery } from "../../services/artwork.js";
import globalStyles from "../../styles/global.js";

const MyArtwork = () => {
  const [state, setState] = useState({
    loading: true,
    artwork: [],
    hasMore: true,
    dataCursor: 0,
    dataCeiling: 20,
  });

  const history = useHistory();
  const globalClasses = globalStyles();

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

  const handleEdit = (artworkId) => {
    history.push(`/edit_artwork/${artworkId}`);
  };

  const handleDelete = async (artworkId) => {
    setState({
      ...state,
      loading: true,
    });
    try {
      await deleteArtwork({
        artworkId,
      });
      setState({
        ...state,
        loading: false,
        artwork: state.artwork.filter((item) => item._id !== artworkId),
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  const actionsColumn = (artworkId) => (
    <Box>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          e.persist();
          handleEdit(artworkId);
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          e.persist();
          handleDelete(artworkId);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );

  useEffect(() => {
    fetchArtwork();
  }, []);

  function handleRowClick(id) {
    history.push(`/artwork/${id}`);
  }

  return (
    <Container fixed className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <Datatable
            title="My artwork"
            columns={[
              {
                name: "Id",
                options: {
                  display: false,
                },
              },
              {
                name: "Artwork",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) => (
                    <img style={{ width: "85%", maxWidth: 200 }} src={value} />
                  ),
                  sort: false,
                },
              },
              {
                name: "Title",
                options: {
                  sortCompare: (order) => {
                    return (obj1, obj2) =>
                      obj1.data.localeCompare(obj2.data, "en", {
                        numeric: true,
                      }) * (order === "asc" ? 1 : -1);
                  },
                },
              },
              "Availability",
              "Type",
              {
                name: "Personal license",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) =>
                    value.use === "included"
                      ? "/"
                      : value.amount
                      ? `$${value.amount}`
                      : "Free",
                  sortCompare: (order) => {
                    return ({ data: previous }, { data: next }) => {
                      return (previous - next) * (order === "asc" ? 1 : -1);
                    };
                  },
                },
              },
              {
                name: "Commercial license",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) =>
                    value.license === "personal"
                      ? "/"
                      : value.amount
                      ? `$${value.amount}`
                      : "Free",
                  sortCompare: (order) => {
                    return ({ data: previous }, { data: next }) => {
                      return (previous - next) * (order === "asc" ? 1 : -1);
                    };
                  },
                },
              },
              {
                name: "Date",
                options: {
                  customBodyRender: (value) =>
                    formatDate(value, "dd/MM/yy HH:mm"),
                  sortCompare: (order) => {
                    return ({ data: previous }, { data: next }) => {
                      console.log(previous);
                      return (
                        (new Date(previous).getTime() -
                          new Date(next).getTime()) *
                        (order === "asc" ? 1 : -1)
                      );
                    };
                  },
                },
              },
              {
                name: "Actions",
              },
            ]}
            data={state.artwork.map((artwork) => [
              artwork._id,
              artwork.current.cover,
              artwork.current.title,
              artwork.current.availability,
              artwork.current.type,
              { use: artwork.current.use, amount: artwork.current.personal },
              {
                license: artwork.current.license,
                amount: artwork.current.commercial,
              },
              artwork.current.created,
              actionsColumn(artwork._id),
            ])}
            empty="You have no artwork"
            loading={state.loading}
            redirect="artwork"
            selectable={false}
            searchable={true}
            pagination={true}
            addOptions={{
              enabled: true,
              title: "Add artwork",
              route: "add_artwork",
            }}
            editOptions={{
              enabled: true,
              title: "Edit artwork",
              route: "edit_artwork",
            }}
            deleteOptions={{
              enabled: true,
              title: "Delete artwork",
              route: "delete_artwork",
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MyArtwork;
