import React from "react";
import { formatArtworkPrice, formatDate } from "../../../../common/helpers";
import Datatable from "../../components/DataTable/index";
import { useUserStore } from "../../contexts/global/user";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import {
  determineLoadingState,
  renderTableBody,
  renderUserData,
} from "../../utils/helpers";

const renderColumns = (isSeller, loading) => [
  {
    name: "Order Id",
    options: {
      sort: false,
      customBodyRender: (value) => renderTableBody(value, loading),
    },
  },
  {
    name: "Buyer",
    options: {
      sort: false,
      customBodyRender: (value) => renderTableBody(value, loading),
    },
  },
  {
    name: "Seller",
    options: {
      sort: false,
      customBodyRender: (value) =>
        renderTableBody(
          renderUserData({ data: value, isUsername: true }),
          loading
        ),
    },
  },
  {
    name: "Discount",
    options: {
      sort: false,
      customBodyRender: (value) =>
        renderTableBody(value ? `${value?.discount * 100}%` : "None", loading),
    },
  },
  {
    name: isSeller ? "Earned" : "Spent",
    options: {
      sort: false,
      customBodyRender: (value) =>
        renderTableBody(
          formatArtworkPrice({ price: value, withPrecision: true }),
          loading
        ),
    },
  },
  {
    name: "Date",
    options: {
      sort: false,
      customBodyRender: (value) =>
        renderTableBody(formatDate(value, "dd/MM/yy HH:mm"), loading),
    },
  },
];

const renderData = (order, isSeller, loading) => [
  determineLoadingState(loading, 1, [
    order?.id,
    order?.buyer?.name,
    order?.seller?.name,
    order?.discount,
    isSeller ? order?.earned : order?.spent,
    order?.created,
  ]),
];

const OrderCard = () => {
  const userId = useUserStore((state) => state.id);

  const order = useOrderDetails((state) => state.order.data);
  const seller = useOrderDetails((state) => state.order.data.seller);
  const loading = useOrderDetails((state) => state.order.loading);

  const isSeller = seller.id === userId;

  return (
    <Datatable
      title="Order"
      columns={renderColumns(isSeller, loading)}
      data={renderData(order, isSeller, loading)}
      label="Order not found"
      loading={loading}
      redirect=""
      selectable="none"
      hoverable={false}
      searchable={false}
      pagination={false}
      addOptions={{ enabled: false, title: "", route: "" }}
      className="NoTableFooter"
    />
  );
};

export default OrderCard;
