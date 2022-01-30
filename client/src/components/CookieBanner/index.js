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
          This website uses cookies to ensure the best website experience. By
          continuing to use this website you are giving your consent to cookies
          being used. Detailed information about the use of cookies can be found{" "}
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
        Accept
      </SyncButton>
    </Box>
  );
};

export default CookieBanner;
