import React from "react";
import { formatArtworkPrice, formatDate } from "../../../../common/helpers";
import Datatable from "../../components/DataTable/index";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import { capitalizeWord } from "../../utils/helpers";
import licenseCardStyles from "./styles";

const LicenseCard = () => {
  const license = useOrderDetails((state) => state.order.data.license);
  const loading = useOrderDetails((state) => state.order.loading);

  const classes = licenseCardStyles();

  return (
    <Datatable
      title="License"
      columns={[
        {
          name: "Id",
          options: {
            display: false,
          },
        },
        {
          name: "Fingerprint",
          options: {
            sort: false,
          },
        },
        {
          name: "Type",
          options: {
            customBodyRender: (value) => capitalizeWord({ value }) || "/",
            sort: false,
          },
        },
        {
          name: "Assignee",
          options: {
            sort: false,
          },
        },
        {
          name: "Assignee identifier",
          options: {
            sort: false,
          },
        },
        {
          name: "Assignor identifier",
          options: {
            sort: false,
          },
        },
        {
          name: "Value",
          options: {
            sort: false,
            customBodyRender: (value) => formatArtworkPrice({ price: value }),
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
        ...(!loading
          ? [
              [
                license.id,
                license.fingerprint,
                license.type,
                license.usage === "business"
                  ? license.company || "Hidden"
                  : license.assignee || "Hidden",
                license.assigneeIdentifier || "Hidden",
                license.assignorIdentifier || "Hidden",
                license.price,
                license.created &&
                  formatDate(license.created, "dd/MM/yy HH:mm"),
              ],
            ]
          : []),
      ]}
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
