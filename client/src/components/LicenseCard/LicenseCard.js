import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { formatDate } from "../../../../common/helpers.js";
import Datatable from "../../components/Datatable/Datatable.js";
import EmptySection from "../EmptySection/EmptySection.js";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const LicenseCard = ({ license, order, isSeller, loading }) => {
  const classes = useStyles();

  return (
    <Datatable
      title="License information"
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
          name: "Assignee",
          options: {
            sort: false,
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
          license._id,
          license.fingerprint,
          license.type,
          license.assignee,
          isSeller() ? order.earned : order.spent,
          license.created && formatDate(license.created, "dd/MM/yy HH:mm"),
        ],
      ]}
      empty={<EmptySection label="License not found" loading={loading} />}
      loading={loading}
      redirect=""
      selectable={false}
      searchable={false}
      pagination={false}
      addOptions={{ enabled: false, title: "", route: "" }}
      editOptions={{
        enabled: false,
        title: "",
        route: "",
      }}
      deleteOptions={{
        enabled: false,
        title: "",
        route: "",
      }}
    />
  );
};

export default LicenseCard;
