import React from "react";
import {
  formatArtworkPrice,
  formatDate,
  isObjectEmpty,
} from "../../../../common/helpers";
import DataTable from "../../components/DataTable";
import EmptySection from "../../components/EmptySection";
import SubHeading from "../../components/SubHeading";
import { useLicenseVerifier } from "../../contexts/local/licenseVerifier";
import Card from "../../domain/Card";
import licenseSectionStyles from "./styles";

const LicenseSection = () => {
  const license = useLicenseVerifier((state) => state.license.data);
  const loading = useLicenseVerifier((state) => state.license.loading);

  const classes = licenseSectionStyles();

  return loading || !license ? (
    <Card className={classes.emptyWrapper}>
      <EmptySection label="Enter license fingerprint to inspect the details" />
    </Card>
  ) : isObjectEmpty(license) ? (
    <Card>
      <EmptySection label="License not found" />
    </Card>
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
          name: "Assignee",
          options: {
            sort: false,
          },
        },
        {
          name: "Assignor",
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
        [
          license.id,
          license.fingerprint,
          license.type,
          license.owner.name,
          license.artwork.owner.name,
          license.usage === "business"
            ? license.company || "Hidden"
            : license.assignee || "Hidden",
          license.assignor || "Hidden",
          license.price,
          license.created && formatDate(license.created, "dd/MM/yy HH:mm"),
        ],
      ]}
      label="License not found"
      loading={loading}
      redirect=""
      selectable="none"
      hoverable={false}
      searchable={false}
      pagination={false}
      addOptions={{ enabled: false, title: "", route: "" }}
      className="NoTableFooter VerifierTable"
    />
  );
};

export default LicenseSection;
