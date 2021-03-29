import { Typography } from "@material-ui/core";
import { format } from "date-fns";
import { withSnackbar } from "notistack";
import React from "react";
import { useLicenseVerifier } from "../../contexts/local/licenseVerifier";

const LicenseSection = () => {
  const license = useLicenseVerifier((state) => state.license.data);
  const loading = useLicenseVerifier((state) => state.license.loading);

  const formatDate = (date, type) => {
    return format(new Date(date), type);
  };

  return !loading ? (
    <div className="table-responsive">
      <table className="simple">
        <thead>
          <tr>
            <th>Fingerprint</th>
            <th>Type</th>
            <th>Buyer</th>
            <th>Seller</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr key={license.id}>
            <td>
              <Typography className="truncate">
                {license.fingerprint}
              </Typography>
            </td>
            <td className="w-64 text-right">
              <span className="truncate">{license.type}</span>
            </td>
            <td className="w-64 text-right">
              <span className="truncate">{license.owner.name}</span>
            </td>
            <td className="w-64 text-right">
              <span className="truncate">{license.artwork.owner.name}</span>
            </td>
            <td className="w-64 text-right">
              <span className="truncate">${license.price}</span>
            </td>
            <td className="w-64 text-right">
              <span className="truncate">
                {formatDate(license.created, "dd/MM/yyyy")}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : null;
};

export default withSnackbar(LicenseSection);
