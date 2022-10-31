import React from "react";
import { Link as RouterLink } from "react-router-dom";
import HelpBox from "../HelpBox";
import Box from "../../domain/Box";
import Typography from "../../domain/Typography";
import licenseAlertStyles from "./styles";

const LicenseAlert = ({ licenseStatus }) => {
  const classes = licenseAlertStyles();

  return (
    <div>
      <HelpBox
        type="alert"
        label={
          licenseStatus.valid
            ? "You already own a license for this artwork"
            : licenseStatus.state.message
        }
        margin="8px 0"
      />
      <Box className={classes.alert}>
        <Typography
          className={classes.link}
          component={RouterLink}
          to={
            licenseStatus.valid ? "/orders" : `/orders/${licenseStatus.ref.id}`
          }
          variant="body1"
          noWrap
        >
          {licenseStatus.valid
            ? "Visit your orders"
            : "Click here to visit your order"}
        </Typography>
      </Box>
    </div>
  );
};

export default LicenseAlert;
