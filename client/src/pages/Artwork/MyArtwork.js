import { Box, Container, Grid, IconButton } from "@material-ui/core";
import {
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
} from "@material-ui/icons";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
import Datatable from "../../components/DataTable/index.js";
import EmptySection from "../../components/EmptySection/index.js";
import PromptModal from "../../components/PromptModal/index.js";
import { deleteArtwork, getGallery } from "../../services/artwork.js";
import globalStyles from "../../styles/global.js";

const MyArtwork = ({ location }) => {
  const [state, setState] = useState({
    loading: true,
    artwork: [],
    hasMore: true,
    dataCursor: 0,
    dataCeiling: 20,
    modal: {
      id: null,
      open: false,
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();
  const globalClasses = globalStyles();

  const fetchArtwork = async () => {
    try {
      const { data } = await getGallery.request({
        dataCursor: state.dataCursor,
        dataCeiling: state.dataCeiling,
      });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        artwork: data.artwork,
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleModalOpen = (id) => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        id,
        open: true,
      },
    }));
  };

  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: {
        ...prevState.modal,
        id: null,
        open: false,
      },
    }));
  };

  const handleArtworkEdit = (artworkId) => {
    history.push(`/edit_artwork/${artworkId}`);
  };

  const handleArtworkDelete = async (artworkId) => {
    setState({
      ...state,
      loading: true,
    });
    try {
      await deleteArtwork.request({
        artworkId,
      });
      setState({
        ...state,
        loading: false,
        artwork: state.artwork.filter((item) => item._id !== artworkId),
        modal: {
          ...state.modal,
          id: null,
          open: false,
        },
      });
      enqueueSnackbar(deleteArtwork.success.message, {
        variant: deleteArtwork.success.variant,
      });
    } catch (err) {
      setState({
        ...state,
        loading: false,
        modal: { ...state.modal, id: null, open: false },
      });
      enqueueSnackbar(deleteArtwork.error.message, {
        variant: deleteArtwork.error.variant,
      });
    }
  };

  const actionsColumn = (artworkId) => (
    <Box>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          e.persist();
          handleArtworkEdit(artworkId);
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          e.persist();
          handleModalOpen(artworkId);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );

  useEffect(() => {
    fetchArtwork();
  }, []);

  return (
    <Container className={globalClasses.gridContainer}>
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
              {
                name: "Type",
                options: {
                  customBodyRender: (value, tableMeta, updateValue) =>
                    value || "/",
                },
              },
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
                      return (
                        (previous.amount - next.amount) *
                        (order === "asc" ? 1 : -1)
                      );
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
                      return (
                        (previous.amount - next.amount) *
                        (order === "asc" ? 1 : -1)
                      );
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
                options: {
                  sort: false,
                },
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
            empty={
              <EmptySection
                label="You have no published artwork"
                loading={state.loading}
              />
            }
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
      <PromptModal
        open={state.modal.open}
        handleConfirm={handleArtworkDelete}
        handleClose={handleModalClose}
        ariaLabel="Delete artwork"
        promptTitle="Are you sure you want to delete this artwork?"
        promptConfirm="Delete"
        promptCancel="Cancel"
      />
    </Container>
  );
};

export default MyArtwork;
