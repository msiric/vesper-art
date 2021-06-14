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
import { useAppStore } from "../../contexts/global/app.js";
import { artepunktTheme } from "../../styles/theme.js";

const useStyles = makeStyles(() => ({
  wrapper: {
    backgroundColor: artepunktTheme.palette.background.notification,
    border: `1px solid ${artepunktTheme.palette.border.main}`,
  },
}));

const iconItems = {
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
};

const App = () => {
  const theme = useAppStore((state) => state.theme);

  const notistackRef = createRef();

  const classes = useStyles();

  const handleAlertClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <ThemeProvider
      theme={{
        ...artepunktTheme,
        palette: { ...artepunktTheme.palette, type: theme },
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
        iconVariant={iconItems}
        classes={{
          variantSuccess: classes.wrapper,
          variantError: classes.wrapper,
          variantWarning: classes.wrapper,
          variantInfo: classes.wrapper,
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
          <Router />
        </SimpleReactLightbox>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
