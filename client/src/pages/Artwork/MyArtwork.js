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
import { useUserStore } from "../../contexts/global/user.js";
import { deleteArtwork, getGallery } from "../../services/artwork.js";
import globalStyles from "../../styles/global.js";

const MyArtwork = ({ location }) => {
  const userId = useUserStore((state) => state.id);

  const [state, setState] = useState({
    isDeleting: false,
    loading: true,
    artwork: [],
    hasMore: true,
    cursor: "",
    limit: 20,
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
        userId,
        cursor: state.cursor,
        limit: state.limit,
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
    history.push(`/artwork/${artworkId}/edit`);
  };

  const handleArtworkDelete = async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        isDeleting: true,
      }));
      await deleteArtwork.request({
        artworkId: state.modal.id,
      });
      setState((prevState) => ({
        ...prevState,
        isDeleting: false,
        artwork: prevState.artwork.filter(
          (item) => item.id !== prevState.modal.id
        ),
        modal: {
          ...prevState.modal,
          id: null,
          open: false,
        },
      }));
      enqueueSnackbar(deleteArtwork.success.message, {
        variant: deleteArtwork.success.variant,
      });
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        isDeleting: false,
        modal: { ...prevState.modal, id: null, open: false },
      }));
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
              artwork.id,
              artwork.current.cover.source,
              artwork.current.title,
              artwork.current.availability,
              artwork.current.type,
              { use: artwork.current.use, amount: artwork.current.personal },
              {
                license: artwork.current.license,
                amount: artwork.current.commercial,
              },
              artwork.current.created,
              actionsColumn(artwork.id),
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
              route: "artwork/add",
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
        isSubmitting={state.isDeleting}
      />
    </Container>
  );
};

export default MyArtwork;
