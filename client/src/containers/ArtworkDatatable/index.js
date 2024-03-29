import { useWindowDimensions } from "@hooks/useWindowDimensions";
import {
  DeleteOutlineRounded as DeleteIcon,
  EditOutlined as EditIcon,
} from "@material-ui/icons";
import { datatableRowsPerPage } from "@shared/constants";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { formatArtworkPrice, formatDate } from "../../../../common/helpers";
import ArtworkThumbnail from "../../components/ArtworkThumbnail/index";
import Datatable from "../../components/DataTable/index";
import { useUserStore } from "../../contexts/global/user";
import { useUserUploads } from "../../contexts/local/userUploads";
import Box from "../../domain/Box";
import IconButton from "../../domain/IconButton";
import {
  capitalizeWord,
  determineLoadingState,
  renderTableBody,
} from "../../utils/helpers";
import artworkDatatableStyles from "./styles";

const renderColumns = (loading, width, classes) => [
  {
    name: "Id",
    options: {
      display: false,
    },
  },
  {
    name: "Artwork",
    options: {
      setCellProps: () => ({
        className: classes.artwork,
      }),
      customBodyRender: (value) =>
        renderTableBody(<ArtworkThumbnail source={value} />, loading, width),
      sort: false,
    },
  },
  {
    name: "Title",
    options: {
      sortCompare:
        (order) =>
        ({ data: previous }, { data: next }) =>
          previous.localeCompare(next, "en", {
            numeric: true,
          }) * (order === "asc" ? 1 : -1),
      customBodyRender: (value) =>
        renderTableBody(value ?? "Loading artwork title", loading),
      sort: !loading,
    },
  },
  {
    name: "Type",
    options: {
      customBodyRender: (value) =>
        renderTableBody(
          capitalizeWord({
            value: value === "unavailable" ? "preview only" : value,
          }) || "/",
          loading
        ),
      sort: !loading,
    },
  },
  {
    name: "PL",
    options: {
      sortCompare:
        (order) =>
        ({ data: previous }, { data: next }) =>
          (previous.amount - next.amount) * (order === "asc" ? 1 : -1),
      customBodyRender: (value) =>
        renderTableBody(
          formatArtworkPrice({
            price: value.amount,
          }),
          loading
        ),
      sort: !loading,
    },
  },
  {
    name: "CL",
    options: {
      sortCompare:
        (order) =>
        ({ data: previous }, { data: next }) =>
          (previous.amount - next.amount) * (order === "asc" ? 1 : -1),
      customBodyRender: (value) =>
        renderTableBody(
          formatArtworkPrice({
            price: value.amount,
          }),
          loading
        ),
      sort: !loading,
    },
  },
  {
    name: "Visibility",
    options: {
      sortCompare:
        (order) =>
        ({ data: previous }, { data: next }) =>
          previous.localeCompare(next, "en", {
            numeric: true,
          }) * (order === "asc" ? 1 : -1),
      customBodyRender: (value) =>
        renderTableBody(capitalizeWord({ value }) || "/", loading),
      sort: !loading,
    },
  },
  {
    name: "Date",
    options: {
      sortCompare:
        (order) =>
        ({ data: previous }, { data: next }) =>
          (new Date(previous).getTime() - new Date(next).getTime()) *
          (order === "asc" ? 1 : -1),
      customBodyRender: (value) =>
        renderTableBody(formatDate(value, "dd/MM/yy HH:mm"), loading),
      sort: !loading,
    },
  },
  {
    name: "Actions",
    options: {
      sort: false,
    },
  },
];

const renderData = (uploads, actionsColumn, loading) =>
  determineLoadingState(loading, datatableRowsPerPage, uploads).map(
    (artwork) => [
      artwork?.id,
      artwork?.current?.cover.source,
      artwork?.current?.title,
      artwork?.current?.type,
      {
        amount: artwork?.current?.personal,
        availability: artwork?.current?.availability,
        use: artwork?.current?.use,
      },
      {
        amount: artwork?.current?.commercial,
        availability: artwork?.current?.availability,
        use: artwork?.current?.use,
      },
      artwork?.visibility,
      artwork?.current?.created,
      actionsColumn(artwork?.id),
    ]
  );

const ArtworkDatatable = () => {
  const userId = useUserStore((state) => state.id);

  const uploads = useUserUploads((state) => state.uploads.data);
  const loading = useUserUploads((state) => state.uploads.loading);
  const fetchUploads = useUserUploads((state) => state.fetchUploads);
  const openModal = useUserUploads((state) => state.openModal);

  const { width } = useWindowDimensions();

  const history = useHistory();

  const classes = artworkDatatableStyles();

  const handleArtworkEdit = (artworkId) => {
    history.push(`/artwork/${artworkId}/edit`);
  };

  const actionsColumn = (artworkId) => (
    <Box className={classes.wrapper}>
      <IconButton
        title="Edit artwork"
        aria-label="Edit artwork"
        color="secondary"
        disabled={loading}
        className={classes.button}
        onClick={(e) => {
          e.stopPropagation();
          e.persist();
          handleArtworkEdit(artworkId);
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        title="Delete artwork"
        aria-label="Delete artwork"
        color="primary"
        disabled={loading}
        className={classes.button}
        onClick={(e) => {
          e.stopPropagation();
          e.persist();
          openModal({ artworkId });
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );

  useEffect(() => {
    fetchUploads({ userId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <Datatable
      title="My artwork"
      columns={renderColumns(loading, width, classes)}
      data={renderData(uploads, actionsColumn, loading)}
      label="You have no published artwork"
      loading={loading}
      redirect="artwork"
      selectable="none"
      hoverable
      searchable
      pagination
      addOptions={{
        enabled: true,
        title: "Add artwork",
        route: "artwork/add",
      }}
      height={400}
    />
  );
};

export default ArtworkDatatable;
