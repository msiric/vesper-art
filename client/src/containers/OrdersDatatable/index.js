import { Rating } from "@material-ui/lab";
import React, { useEffect } from "react";
import { formatDate } from "../../../../common/helpers";
import ArtworkThumbnail from "../../components/ArtworkThumbnail/index";
import Datatable from "../../components/DataTable/index";
import EmptySection from "../../components/EmptySection/index";
import { useUserOrders } from "../../contexts/local/userOrders";
import { renderUserData } from "../../utils/helpers";

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
            customBodyRender: (value) => (
              <ArtworkThumbnail source={value.source} />
            ),
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
        {
          name: display === "purchases" ? "Seller" : "Buyer",
          options: {
            sortCompare: (order) => (obj1, obj2) =>
              obj1.data.localeCompare(obj2.data, "en", {
                numeric: true,
              }) * (order === "asc" ? 1 : -1),
            customBodyRender: (value) =>
              renderUserData({ data: value, isUsername: true }),
          },
        },
        {
          name: "Amount",
          options: {
            customBodyRender: (value) => (value ? `$${value}` : "Free"),
            sortCompare:
              (order) =>
              ({ data: previous }, { data: next }) =>
                (previous - next) * (order === "asc" ? 1 : -1),
          },
        },
        {
          name: "Assignee",
          options: {
            sortCompare: (order) => (obj1, obj2) =>
              obj1.data.localeCompare(obj2.data, "en", {
                numeric: true,
              }) * (order === "asc" ? 1 : -1),
          },
        },
        {
          name: "Rating",
          options: {
            customBodyRender: (value) =>
              value ? <Rating value={value.rating} readOnly /> : "Not rated",
            sortCompare:
              (order) =>
              ({ data: previous }, { data: next }) =>
                ((previous ? previous.rating : 0) - (next ? next.rating : 0)) *
                (order === "asc" ? 1 : -1),
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
        ,
      ]}
      data={orders.map((order) => [
        order.id,
        order.version.cover,
        order.version.title,
        display === "purchases"
          ? order.seller && order.seller.name
          : order.buyer && order.buyer.name,
        display === "purchases" ? order.spent : order.earned,
        display === "purchases"
          ? order.license.usage === "business"
            ? order.license.company
            : order.license.assignee
          : "Hidden",
        order.review,
        order.created,
      ])}
      empty={<EmptySection label="You have no orders" loading={loading} />}
      loading={loading}
      redirect="orders"
      selectable="none"
      hoverable={true}
      searchable={true}
      pagination={true}
      addOptions={{ enabled: false, title: "", route: "" }}
      customPadding={true}
    />
  );
};

export default OrdersDatatable;
