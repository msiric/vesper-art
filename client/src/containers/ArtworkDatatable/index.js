import {
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
import ArtworkThumbnail from "../../components/ArtworkThumbnail/index.js";
import Datatable from "../../components/DataTable/index.js";
import EmptySection from "../../components/EmptySection/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useUserUploads } from "../../contexts/local/userUploads";
import Box from "../../domain/Box";
import IconButton from "../../domain/IconButton";

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
            sortCompare: (order) => (obj1, obj2) =>
              obj1.data.localeCompare(obj2.data, "en", {
                numeric: true,
              }) * (order === "asc" ? 1 : -1),
          },
        },
        "Availability",
        {
          name: "Type",
          options: {
            customBodyRender: (value, tableMeta, updateValue) => value || "/",
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
            sortCompare: (order) => ({ data: previous }, { data: next }) =>
              (previous.amount - next.amount) * (order === "asc" ? 1 : -1),
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
            sortCompare: (order) => ({ data: previous }, { data: next }) =>
              (previous.amount - next.amount) * (order === "asc" ? 1 : -1),
          },
        },
        {
          name: "Date",
          options: {
            customBodyRender: (value) => formatDate(value, "dd/MM/yy HH:mm"),
            sortCompare: (order) => ({ data: previous }, { data: next }) =>
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
        <EmptySection label="You have no published artwork" loading={loading} />
      }
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
    />
  );
};

export default ArtworkDatatable;