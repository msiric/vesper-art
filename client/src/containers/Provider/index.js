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
import { useAppStore } from "../../contexts/global/app";
import globalStyles from "../../styles/global";
import { artepunktTheme } from "../../styles/theme";
import Interceptor from "../Interceptor/Interceptor";

const useStyles = makeStyles(() => ({
  wrapper: {
    backgroundColor: artepunktTheme.palette.background.notification,
    border: `1px solid ${artepunktTheme.palette.border.main}`,
  },
  icon: {
    marginRight: 12,
  },
  success: {
    color: artepunktTheme.palette.success.main,
  },
  error: {
    color: artepunktTheme.palette.error.main,
  },
  warning: {
    color: artepunktTheme.palette.warning.main,
  },
  info: {
    color: artepunktTheme.palette.info.main,
  },
}));

const Provider = () => {
  const theme = useAppStore((state) => state.theme);

  const notistackRef = createRef();

  const globalClasses = globalStyles();
  const classes = useStyles();

  const iconItems = {
    success: <SuccessIcon className={`${classes.icon} ${classes.success}`} />,
    error: <ErrorIcon className={`${classes.icon} ${classes.error}`} />,
    warning: <WarningIcon className={`${classes.icon} ${classes.warning}`} />,
    info: <InfoIcon className={`${classes.icon} ${classes.info}`} />,
  };

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
          vertical: "bottom",
          horizontal: "left",
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
        <CssBaseline />
        <Interceptor />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Provider;
