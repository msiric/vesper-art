import { makeStyles } from "@material-ui/core";
import { ShoppingBasketOutlined as BuyingIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { appName } from "../../../../common/constants";
import SyncButton from "../../components/SyncButton";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useSellingStyles = makeStyles((muiTheme) => ({
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

const Selling = () => {
  const globalClasses = globalStyles();
  const classes = useSellingStyles();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">{`Selling on ${appName}`}</Typography>
          <Typography className={classes.paragraph}>
            Start a temporary account to upload artwork on Vesper. Your art can be published as “preview only” for visitors to view, or “available for download” to try the collection workflow.
          </Typography>
          <Typography className={classes.paragraph}>
            Add a title, description and tags, then choose the options available for your artwork. You can edit your own work and control how it is displayed.
          </Typography>
          <Typography className={classes.paragraph}>
            Use a small JPEG or PNG image you have permission to share. Uploads are limited to 2 MB and 4 megapixels, and are resized for display. Artwork and comments can be visible to other visitors, so use non-sensitive test content.
          </Typography>
          <Typography className={classes.paragraph}>
            Selling and Stripe onboarding are unavailable in this version. Collectors can create sample orders for eligible artwork; no money changes hands and no real license is issued.
          </Typography>
          <Typography className={classes.paragraph}>
            Accounts expire after 24 hours. Expired records are removed when a later session starts, so keep your original files elsewhere.
          </Typography>
        </Grid>
        <Grid item sm={12} className={classes.wrapper}>
          <Box className={classes.actions}>
            <Typography variant="h4" className={classes.label}>
              {`Learn about buying on ${appName}`}
            </Typography>
            <Box className={classes.buttons}>
              <SyncButton
                variant="text"
                component={RouterLink}
                to="/start_buying"
                startIcon={<BuyingIcon />}
              >{`Buying on ${appName}`}</SyncButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Selling;
