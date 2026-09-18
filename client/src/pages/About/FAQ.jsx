import { makeStyles } from "@material-ui/core";
import {
  ShoppingBasketOutlined as BuyingIcon,
  WallpaperOutlined as SellingIcon,
} from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { appName } from "../../../../common/constants";
import SyncButton from "../../components/SyncButton";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Link from "../../domain/Link";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useFAQStyling = makeStyles((muiTheme) => ({
  heading: {
    marginTop: 16,
    textDecoration: "underline",
  },
  bold: {
    fontWeight: "bold",
  },
  paragraph: {
    marginTop: 16,
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    margin: "0 auto",
    textAlign: "center",
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
  linkLabel: {
    display: "inline",
  },
  link: {
    fontSize: "1rem",
    marginLeft: 3,
  },
}));

const FAQ = () => {
  const globalClasses = globalStyles();
  const classes = useFAQStyling();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">FAQ</Typography>
          <Typography variant="h5" className={classes.heading}>
            Account management
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            How do I get started?
          </Typography>
          <Typography className={classes.paragraph}>
            Choose “Try Vesper” to start a temporary account. No email address, password or payment card is needed.
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            How long does my account last?
          </Typography>
          <Typography className={classes.paragraph}>
            Accounts expire after 24 hours. Expired records are removed when a later session starts. Ending a session signs you out but does not immediately erase its content; there is no password recovery for temporary accounts.
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            What should I upload?
          </Typography>
          <Typography className={classes.paragraph}>
            Use only non-sensitive test images you have permission to share. Artwork, comments and profile details can be visible to other visitors. See the Privacy Policy for details.
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Payments and licenses
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            Can I buy or sell artwork here?
          </Typography>
          <Typography className={classes.paragraph}>
            You can try the order workflow, but payments, seller payouts and real licensing are unavailable. Prices and receipts are examples, and no usage rights are granted.
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            How does license verification work?
          </Typography>
          <Typography className={classes.paragraph}>
            Enter a sample license fingerprint to inspect its order record. You can find more details on the License information page.
          </Typography>
          <Typography variant="h5" className={classes.heading}>
            Using the platform
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            Why can I only preview some artwork?
          </Typography>
          <Typography className={classes.paragraph}>
            Artists choose whether their artwork is “preview only” or “available for download”. The latter enables the sample order and collection workflow.
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            Why does starting an account sometimes take a while?
          </Typography>
          <Typography className={classes.paragraph}>
            The server sleeps when idle and may take about a minute to start. You can browse the sample gallery while it is unavailable.
          </Typography>
          <Typography className={`${classes.paragraph} ${classes.bold}`}>
            Are there usage limits?
          </Typography>
          <Typography className={classes.paragraph}>
            Each account allows 60 changes and 2 MiB of stored images. JPEG and PNG uploads are limited to 2 MB and 4 megapixels before resizing. If the service reaches its limits, the sample gallery remains available.
          </Typography>
        </Grid>
        <Grid item sm={12} className={classes.wrapper}>
          <Box className={classes.actions}>
            <Typography variant="h4" className={classes.label}>
              {`Learn more about how ${appName} works`}
            </Typography>
            <Box className={classes.buttons}>
              <SyncButton
                variant="text"
                component={RouterLink}
                to="/start_selling"
                color="secondary"
                startIcon={<SellingIcon />}
              >{`Selling on ${appName}`}</SyncButton>
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

export default FAQ;
