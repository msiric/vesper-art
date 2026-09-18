import React from "react";
import { formatArtworkPrice, formatDate } from "../../../../common/helpers";
import Datatable from "../../components/DataTable/index";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import {
  capitalizeWord,
  determineLoadingState,
  renderTableBody,
} from "../../utils/helpers";

const renderColumns = (loading) => [
  {
    name: "Id",
    options: {
      display: false,
      customBodyRender: (value) => renderTableBody(value, loading),
    },
  },
  {
    name: "Fingerprint",
    options: {
      sort: false,
      customBodyRender: (value) => renderTableBody(value, loading),
    },
  },
  {
    name: "Type",
    options: {
      sort: false,
      customBodyRender: (value) =>
        renderTableBody(capitalizeWord({ value }) || "/", loading),
    },
  },
  {
    name: "Assignee",
    options: {
      sort: false,
      customBodyRender: (value) => renderTableBody(value, loading),
    },
  },
  {
    name: "Assignee identifier",
    options: {
      sort: false,
      customBodyRender: (value) => renderTableBody(value, loading),
    },
  },
  {
    name: "Assignor identifier",
    options: {
      sort: false,
      customBodyRender: (value) => renderTableBody(value, loading),
    },
  },
  {
    name: "Value",
    options: {
      sort: false,
      customBodyRender: (value) =>
        renderTableBody(formatArtworkPrice({ price: value }), loading),
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

const renderData = (license, loading) => [
  determineLoadingState(loading, 1, [
    license?.id,
    license?.fingerprint,
    license?.type,
    license?.usage === "business"
      ? license?.company || "Hidden"
      : license?.assignee || "Hidden",
    license?.assigneeIdentifier || "Hidden",
    license?.assignorIdentifier || "Hidden",
    license?.price,
    license?.created,
  ]),
];

const LicenseCard = () => {
  const license = useOrderDetails((state) => state.order.data.license);
  const loading = useOrderDetails((state) => state.order.loading);

  return (
    <Datatable
      title="License"
      columns={renderColumns(loading)}
      data={renderData(license, loading)}
      label="License not found"
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

export default LicenseCard;
