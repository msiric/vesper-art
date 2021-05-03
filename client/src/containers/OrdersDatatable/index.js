import { Rating } from "@material-ui/lab";
import React, { useEffect } from "react";
import { formatDate } from "../../../../common/helpers.js";
import Datatable from "../../components/DataTable/index.js";
import EmptySection from "../../components/EmptySection/index.js";
import { useUserOrders } from "../../contexts/local/userOrders";

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
            customBodyRender: (value, tableMeta, updateValue) => (
              <img style={{ width: "85%", maxWidth: 200 }} src={value.source} />
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
        {
          name: display === "purchases" ? "Seller" : "Buyer",
          options: {
            sortCompare: (order) => {
              return (obj1, obj2) =>
                obj1.data.localeCompare(obj2.data, "en", {
                  numeric: true,
                }) * (order === "asc" ? 1 : -1);
            },
          },
        },
        {
          name: "Amount",
          options: {
            customBodyRender: (value, tableMeta, updateValue) =>
              value ? `$${value}` : "Free",
            sortCompare: (order) => {
              return ({ data: previous }, { data: next }) => {
                return (previous - next) * (order === "asc" ? 1 : -1);
              };
            },
          },
        },
        {
          name: "Rating",
          options: {
            customBodyRender: (value) =>
              value ? <Rating value={value.rating} readOnly /> : "Not rated",
            sortCompare: (order) => {
              return ({ data: previous }, { data: next }) => {
                return (
                  ((previous ? previous.rating : 0) -
                    (next ? next.rating : 0)) *
                  (order === "asc" ? 1 : -1)
                );
              };
            },
          },
        },
        {
          name: "Date",
          options: {
            customBodyRender: (value) => formatDate(value, "dd/MM/yy HH:mm"),
            sortCompare: (order) => {
              return ({ data: previous }, { data: next }) => {
                console.log(previous);
                return (
                  (new Date(previous).getTime() - new Date(next).getTime()) *
                  (order === "asc" ? 1 : -1)
                );
              };
            },
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
        order.review,
        order.created,
      ])}
      empty={<EmptySection label="You have no orders" loading={loading} />}
      loading={loading}
      redirect="orders"
      selectable={false}
      searchable={true}
      pagination={true}
      addOptions={{ enabled: false, title: "", route: "" }}
    />
  );
};

export default OrdersDatatable;
