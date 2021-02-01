import { CssBaseline, IconButton } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import {
  CheckCircleRounded as SuccessIcon,
  CloseRounded as CloseIcon,
  ErrorRounded as ErrorIcon,
  InfoRounded as InfoIcon,
  WarningRounded as WarningIcon,
} from "@material-ui/icons";
import { SnackbarProvider } from "notistack";
import React, { createRef } from "react";
import SimpleReactLightbox from "simple-react-lightbox";
import Router from "../../containers/Router/Router.js";
import { useTracked as useAppContext } from "../../contexts/global/App.js";
import { artepunktTheme } from "../../styles/theme.js";

const useStyles = makeStyles(() => ({
  notificationContainer: {
    backgroundColor: artepunktTheme.palette.background.notification,
    border: `1px solid ${artepunktTheme.palette.border.main}`,
  },
}));

const App = ({ socket }) => {
  const [appStore, appDispatch] = useAppContext();

  const notistackRef = createRef();

  const classes = useStyles();

  const handleAlertClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <ThemeProvider
      theme={{
        ...artepunktTheme,
        palette: { ...artepunktTheme.palette, type: appStore.theme },
      }}
    >
      <SnackbarProvider
        classes={{
          containerAnchorOriginTopCenter: classes.alert,
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        iconVariant={{
          success: (
            <SuccessIcon
              style={{
                marginRight: 12,
                color: artepunktTheme.palette.success.main,
              }}
            />
          ),
          error: (
            <ErrorIcon
              style={{
                marginRight: 12,
                color: artepunktTheme.palette.error.main,
              }}
            />
          ),
          warning: (
            <WarningIcon
              style={{
                marginRight: 12,
                color: artepunktTheme.palette.warning.main,
              }}
            />
          ),
          info: (
            <InfoIcon
              style={{
                marginRight: 12,
                color: artepunktTheme.palette.info.main,
              }}
            />
          ),
        }}
        classes={{
          variantSuccess: classes.notificationContainer,
          variantError: classes.notificationContainer,
          variantWarning: classes.notificationContainer,
          variantInfo: classes.notificationContainer,
        }}
        dense
        maxSnack={1}
        preventDuplicate
        ref={notistackRef}
        autoHideDuration={2500}
        action={(key) => (
          <IconButton
            color="inherit"
            aria-label="Close"
            className={classes.close}
            onClick={handleAlertClose(key)}
          >
            <CloseIcon />
          </IconButton>
        )}
      >
        <SimpleReactLightbox>
          <CssBaseline />
          <Router socket={socket} />
        </SimpleReactLightbox>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
