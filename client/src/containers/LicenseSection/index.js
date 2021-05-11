import { format } from "date-fns";
import { withSnackbar } from "notistack";
import React from "react";
import { isObjectEmpty } from "../../../../common/helpers";
import DataTable from "../../components/DataTable";
import EmptySection from "../../components/EmptySection";
import SubHeading from "../../components/SubHeading";
import { useLicenseVerifier } from "../../contexts/local/licenseVerifier";

const LicenseSection = () => {
  const license = useLicenseVerifier((state) => state.license.data);
  const loading = useLicenseVerifier((state) => state.license.loading);

  const formatDate = (date, type) => {
    return format(new Date(date), type);
  };

  return loading || !license ? (
    <EmptySection label="Enter license fingerprint to inspect the details" />
  ) : isObjectEmpty(license) ? (
    <EmptySection label="License not found" />
  ) : (
    <DataTable
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
          name: "Assignee",
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
          license.assignee,
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

export default withSnackbar(LicenseSection);
