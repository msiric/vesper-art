import {
  DeleteOutlineRounded as DeleteIcon,
  EditOutlined as EditIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { formatArtworkPrice, formatDate } from "../../../../common/helpers";
import ArtworkThumbnail from "../../components/ArtworkThumbnail/index";
import Datatable from "../../components/DataTable/index";
import { useUserStore } from "../../contexts/global/user";
import { useUserUploads } from "../../contexts/local/userUploads";
import Box from "../../domain/Box";
import IconButton from "../../domain/IconButton";
import { capitalizeWord } from "../../utils/helpers";

const ArtworkDatatable = () => {
  const userId = useUserStore((state) => state.id);

  const uploads = useUserUploads((state) => state.uploads.data);
  const loading = useUserUploads((state) => state.uploads.loading);
  const fetchUploads = useUserUploads((state) => state.fetchUploads);
  const openModal = useUserUploads((state) => state.openModal);

  const history = useHistory();

  const handleArtworkEdit = (artworkId) => {
    history.push(`/artwork/${artworkId}/edit`);
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
          openModal({ artworkId });
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );

  useEffect(() => {
    fetchUploads({ userId });
  }, []);

  return (
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
            customBodyRender: (value) => <ArtworkThumbnail source={value} />,
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
          },
        },
        {
          name: "Type",
          options: {
            customBodyRender: (value) =>
              capitalizeWord({
                value: value === "unavailable" ? "preview only" : value,
              }) || "/",
          },
        },
        {
          name: "Personal license",
          options: {
            customBodyRender: (value) =>
              formatArtworkPrice({
                price: value.amount,
              }),
            sortCompare:
              (order) =>
              ({ data: previous }, { data: next }) =>
                (previous.amount - next.amount) * (order === "asc" ? 1 : -1),
          },
        },
        {
          name: "Commercial license",
          options: {
            customBodyRender: (value) =>
              formatArtworkPrice({
                price: value.amount,
              }),
            sortCompare:
              (order) =>
              ({ data: previous }, { data: next }) =>
                (previous.amount - next.amount) * (order === "asc" ? 1 : -1),
          },
        },
        {
          name: "Visibility",
          options: {
            customBodyRender: (value) => capitalizeWord({ value }) || "/",
            sortCompare:
              (order) =>
              ({ data: previous }, { data: next }) =>
                previous.localeCompare(next, "en", {
                  numeric: true,
                }) * (order === "asc" ? 1 : -1),
          },
        },
        {
          name: "Date",
          options: {
            customBodyRender: (value) => formatDate(value, "dd/MM/yy HH:mm"),
            sortCompare:
              (order) =>
              ({ data: previous }, { data: next }) =>
                (new Date(previous).getTime() - new Date(next).getTime()) *
                (order === "asc" ? 1 : -1),
          },
        },
        {
          name: "Actions",
          options: {
            sort: false,
          },
        },
      ]}
      data={uploads.map((artwork) => [
        artwork.id,
        artwork.current.cover.source,
        artwork.current.title,
        artwork.current.type,
        {
          amount: artwork.current.personal,
          availability: artwork.current.availability,
          use: artwork.current.use,
        },
        {
          amount: artwork.current.commercial,
          availability: artwork.current.availability,
          use: artwork.current.use,
        },
        artwork.visibility,
        artwork.current.created,
        actionsColumn(artwork.id),
      ])}
      label="You have no published artwork"
      loading={loading}
      redirect="artwork"
      selectable="none"
      hoverable={true}
      searchable={true}
      pagination={true}
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
