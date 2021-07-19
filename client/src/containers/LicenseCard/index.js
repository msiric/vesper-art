import React from "react";
import { formatDate } from "../../../../common/helpers";
import Datatable from "../../components/DataTable/index";
import EmptySection from "../../components/EmptySection/index";
import SubHeading from "../../components/SubHeading/index";
import { useOrderDetails } from "../../contexts/local/orderDetails";
import licenseCardStyles from "./styles";

const LicenseCard = () => {
  const license = useOrderDetails((state) => state.order.data.license);
  const loading = useOrderDetails((state) => state.order.loading);

  console.log("LICENSE", license);

  const classes = licenseCardStyles();

  return (
    <Datatable
      title={<SubHeading text="License" loading={loading} />}
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
          license.id,
          license.fingerprint,
          license.type,
          license.assigneeIdentifier || "Hidden",
          license.assignorIdentifier || "Hidden",
          license.price,
          license.created && formatDate(license.created, "dd/MM/yy HH:mm"),
        ],
      ]}
      empty={<EmptySection label="License not found" loading={loading} />}
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

export default LicenseCard;
