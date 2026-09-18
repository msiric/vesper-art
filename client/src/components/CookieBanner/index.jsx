import { CheckRounded as SaveIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "../../domain/Box";
import Link from "../../domain/Link";
import Typography from "../../domain/Typography";
import SyncButton from "../SyncButton";
import cookieBannerStyles from "./styles";

const CookieBanner = ({ handleConsent }) => {
  const classes = cookieBannerStyles();

  return (
    <Box className={classes.container}>
      <Box>
        <Typography className={classes.linkLabel}>
          This demo uses an essential session cookie and local display preferences.
          No advertising or app analytics. Learn more{" "}
        </Typography>
        <Link
          component={RouterLink}
          to="/privacy_policy"
          className={classes.link}
        >
          here.
        </Link>
      </Box>
      <SyncButton
        type="submit"
        startIcon={<SaveIcon />}
        onClick={handleConsent}
        className={classes.button}
      >
        Got it
      </SyncButton>
    </Box>
  );
};

export default CookieBanner;
