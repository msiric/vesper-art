import Cookies from "js-cookie";
import React, { useState } from "react";
import { cookieKeys } from "../../../../common/constants";
import CookieBanner from "../../components/CookieBanner";
import Footer from "../../containers/Footer/index";
import Header from "../../containers/Header/index";
import { useAppStore } from "../../contexts/global/app";
import Backdrop from "../../domain/Backdrop";
import Box from "../../domain/Box";
import CircularProgress from "../../domain/CircularProgress";
import mainStyles from "./styles";

const getConsentCookie = () => Cookies.get(cookieKeys.consent);
const setConsentCookie = (value) => Cookies.set(cookieKeys.consent, value);

const MainLayout = ({ children }) => {
  const loading = useAppStore((state) => state.loading);

  const [displayBanner, setDisplayBanner] = useState(!getConsentCookie());

  const classes = mainStyles();

  const handleConsent = () => {
    setConsentCookie(true);
    setDisplayBanner(!getConsentCookie());
  };

  return (
    <Box className={classes.appRoot}>
      {loading ? (
        <Backdrop className={classes.appBackdrop} open={loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      ) : (
        [
          <Header />,
          <Box className={classes.appContainer}>{children}</Box>,
          <Footer />,
          displayBanner && <CookieBanner handleConsent={handleConsent} />,
        ]
      )}
    </Box>
  );
};

export default MainLayout;
