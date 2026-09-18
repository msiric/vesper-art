import { makeStyles } from "@material-ui/core";
import { WallpaperOutlined as SellingIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { appName } from "../../../../common/constants";
import SyncButton from "../../components/SyncButton";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useBuyingStyles = makeStyles((muiTheme) => ({
  paragraph: {
    marginTop: 16,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    margin: "0 auto",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
      height: 80,
    },
  },
  label: {
    marginTop: 8,
    marginBottom: 16,
    [muiTheme.breakpoints.down("xs")]: {
      fontSize: "1.8rem",
    },
  },
}));

const Buying = () => {
  const globalClasses = globalStyles();
  const classes = useBuyingStyles();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">{`Buying on ${appName}`}</Typography>
          <Typography className={classes.paragraph}>
            Browse the gallery to discover artwork and explore each artist’s profile. Start a temporary account to save favorites, leave comments and collect eligible pieces.
          </Typography>
          <Typography className={classes.paragraph}>
            Artists can publish artwork as “preview only” or “available for download”. Pay attention to these options while browsing; preview-only pieces cannot be collected through the order workflow.
          </Typography>
          <Typography className={classes.paragraph}>
            For available artwork, select the personal-license option and create a sample order. You can inspect its receipt and add the artwork to your gallery. There is no payment, and the record grants no real usage rights.
          </Typography>
          <Typography className={classes.paragraph}>
            Your gallery brings the pieces you collect together, with a fullscreen slideshow for viewing them. Order details include a fingerprint you can look up in the license verifier.
          </Typography>
          <Typography className={classes.paragraph}>
            Collections belong to your temporary account and are not permanent. Accounts expire after 24 hours.
          </Typography>
        </Grid>
        <Grid item sm={12} className={classes.wrapper}>
          <Box className={classes.actions}>
            <Typography variant="h4" className={classes.label}>
              {`Learn about selling on ${appName}`}
            </Typography>
            <Box className={classes.buttons}>
              <SyncButton
                variant="text"
                component={RouterLink}
                to="/start_selling"
                startIcon={<SellingIcon />}
              >{`Selling on ${appName}`}</SyncButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Buying;
