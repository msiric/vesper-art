import { Rating } from "@material-ui/lab";
import React, { useEffect } from "react";
import { formatArtworkPrice, formatDate } from "../../../../common/helpers";
import ArtworkThumbnail from "../../components/ArtworkThumbnail/index";
import Datatable from "../../components/DataTable/index";
import { useUserOrders } from "../../contexts/local/userOrders";
import { datatableRowsPerPage } from "../../shared/constants";
import {
  determineLoadingState,
  renderTableBody,
  renderUserData,
} from "../../utils/helpers";

const renderColumns = (display, loading) => [
  {
    name: "Id",
    options: {
      display: false,
    },
  },
  {
    name: "Artwork",
    options: {
      customBodyRender: (value) =>
        renderTableBody(
          <ArtworkThumbnail source={value?.source} />,
          loading,
          false
        ),
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
      customBodyRender: (value) => renderTableBody(value, loading),
    },
  },
  {
    name: display === "purchases" ? "Seller" : "Buyer",
    options: {
      sortCompare:
        (order) =>
        ({ data: previous }, { data: next }) =>
          previous.localeCompare(next, "en", {
            numeric: true,
          }) * (order === "asc" ? 1 : -1),
      customBodyRender: (value) =>
        renderTableBody(
          renderUserData({ data: value, isUsername: true }),
          loading
        ),
    },
  },
  {
    name: "Amount",
    options: {
      sortCompare:
        (order) =>
        ({ data: previous }, { data: next }) =>
          (previous - next) * (order === "asc" ? 1 : -1),
      customBodyRender: (value) =>
        renderTableBody(
          formatArtworkPrice({ price: value, withPrecision: true }),
          loading
        ),
    },
  },
  {
    name: "Assignee",
    options: {
      sortCompare:
        (order) =>
        ({ data: previous }, { data: next }) =>
          previous.localeCompare(next, "en", {
            numeric: true,
          }) * (order === "asc" ? 1 : -1),
      customBodyRender: (value) => renderTableBody(value, loading),
    },
  },
  {
    name: "Rating",
    options: {
      sortCompare:
        (order) =>
        ({ data: previous }, { data: next }) =>
          ((previous ? previous.rating : 0) - (next ? next.rating : 0)) *
          (order === "asc" ? 1 : -1),
      customBodyRender: (value) =>
        renderTableBody(
          value ? <Rating value={value?.rating} readOnly /> : "Not rated",
          loading
        ),
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
    },
  },
];

const renderData = (orders, display, loading) =>
  determineLoadingState(loading, datatableRowsPerPage, orders).map((order) => [
    order?.id,
    order?.version?.cover,
    order?.version?.title,
    display === "purchases" ? order?.seller?.name : order?.buyer?.name,
    display === "purchases" ? order?.spent : order?.earned,
    display === "purchases"
      ? order?.license?.usage === "business"
        ? order?.license?.company
        : order?.license?.assignee
      : "Hidden",
    order?.review,
    order?.created,
  ]);

const OrdersDatatable = () => {
  const orders = useUserOrders((state) => state.orders.data);
  const loading = useUserOrders((state) => state.orders.loading);
  const display = useUserOrders((state) => state.display);
  const fetchOrders = useUserOrders((state) => state.fetchOrders);

  useEffect(() => {
    fetchOrders({ display });
  }, [display]);

  return (
    <Datatable
      title="My orders"
      columns={renderColumns(display, loading)}
      data={renderData(orders, display, loading)}
      label="You have no orders"
      loading={loading}
      redirect="orders"
      selectable="none"
      hoverable
      searchable
      pagination
      addOptions={{ enabled: false, title: "", route: "" }}
      height={400}
    />
  );
};

export default OrdersDatatable;
