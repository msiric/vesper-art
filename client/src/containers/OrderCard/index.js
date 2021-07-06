import React from "react";
import { formatDate } from "../../../../common/helpers";
import Datatable from "../../components/DataTable/index";
import EmptySection from "../../components/EmptySection/index";
import SubHeading from "../../components/SubHeading/index";
import { useUserStore } from "../../contexts/global/user";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import { renderUserData } from "../../utils/helpers";
import orderCardStyles from "./styles";

const OrderCard = () => {
  const userId = useUserStore((state) => state.id);

  const order = useOrderDetails((state) => state.order.data);
  const seller = useOrderDetails((state) => state.order.data.seller);
  const loading = useOrderDetails((state) => state.order.loading);

  const isSeller = () => seller.id === userId;

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
            customBodyRender: (value) =>
              renderUserData({ data: value, isUsername: true }),
          },
        },
        {
          name: "Discount",
          options: {
            sort: false,
            customBodyRender: (value) =>
              value ? `${value.discount * 100}%` : "None",
          },
        },
        {
          name: isSeller() ? "Earned" : "Spent",
          options: {
            sort: false,
            customBodyRender: (value) =>
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
          order.id,
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
      selectable="none"
      hoverable={false}
      searchable={false}
      pagination={false}
      addOptions={{ enabled: false, title: "", route: "" }}
    />
  );
};

export default OrderCard;
