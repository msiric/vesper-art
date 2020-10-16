import { CssBaseline, IconButton } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { CloseRounded as CloseIcon } from "@material-ui/icons";
import { SnackbarProvider } from "notistack";
import React, { createRef, useContext } from "react";
import Router from "../../containers/Router/Router.js";
import { Context } from "../../contexts/Store.js";
import { artepunktTheme } from "../../styles/theme.js";

const App = ({ socket }) => {
  const [store, dispatch] = useContext(Context);
  const notistackRef = createRef();

  const classes = {};

  const handleAlertClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <ThemeProvider
      theme={{
        ...artepunktTheme,
        palette: { ...artepunktTheme.palette, type: store.main.theme },
      }}
    >
      <SnackbarProvider
        classes={{
          containerAnchorOriginTopCenter: classes.alert,
        }}
        dense
        maxSnack={1}
        preventDuplicate
        ref={notistackRef}
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
        <Router socket={socket} />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
