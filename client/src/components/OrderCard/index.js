import React from "react";
import { formatDate } from "../../../../common/helpers.js";
import Datatable from "../../components/DataTable/index.js";
import EmptySection from "../../components/EmptySection/index.js";
import SubHeading from "../../components/SubHeading/index.js";
import orderCardStyles from "./styles.js";

const OrderCard = ({ order, isSeller, loading }) => {
  const classes = orderCardStyles();

  return (
    <Datatable
      title={<SubHeading text="Order" loading={loading} />}
      columns={[
        {
          name: "Order Id",
          options: {
            sort: false,
          },
        },
        {
          name: "Buyer",
          options: {
            sort: false,
          },
        },
        {
          name: "Seller",
          options: {
            sort: false,
          },
        },
        {
          name: "Discount",
          options: {
            sort: false,
            customBodyRender: (value, tableMeta, updateValue) =>
              value ? `${value.discount * 100}%` : "None",
          },
        },
        {
          name: isSeller() ? "Earned" : "Spent",
          options: {
            sort: false,
            customBodyRender: (value, tableMeta, updateValue) =>
              typeof value !== "undefined"
                ? value
                  ? `$${value}`
                  : "Free"
                : null,
          },
        },
        {
          name: "Date",
          options: {
            sort: false,
          },
        },
      ]}
      data={[
        [
          order._id,
          order.buyer.name,
          order.seller.name,
          order.discount,
          isSeller() ? order.earned : order.spent,
          order.created && formatDate(order.created, "dd/MM/yy HH:mm"),
        ],
      ]}
      empty={<EmptySection label="Order not found" loading={loading} />}
      loading={loading}
      redirect=""
      selectable={false}
      searchable={false}
      pagination={false}
      addOptions={{ enabled: false, title: "", route: "" }}
    />
  );
};

export default OrderCard;
