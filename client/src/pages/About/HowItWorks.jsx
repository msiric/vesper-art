import { makeStyles } from "@material-ui/core";
import {
  ShoppingBasketOutlined as BuyingIcon,
  WallpaperOutlined as SellingIcon,
} from "@material-ui/icons";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { appName } from "../../../../common/constants";
import ArtworkGallery from "../../assets/images/illustrations/artwork_gallery.svg?react";
import BrowseArtwork from "../../assets/images/illustrations/browse_artwork.svg?react";
import DisplayCollection from "../../assets/images/illustrations/display_collection.svg?react";
import EarnMoney from "../../assets/images/illustrations/earn_money.svg?react";
import LicenseCertification from "../../assets/images/illustrations/license_certification.svg?react";
import MakeAdjustments from "../../assets/images/illustrations/make_adjustments.svg?react";
import MonitorDashboard from "../../assets/images/illustrations/monitor_dashboard.svg?react";
import ReceiveUpdates from "../../assets/images/illustrations/receive_updates.svg?react";
import SelectArtwork from "../../assets/images/illustrations/select_artwork.svg?react";
import StripePayment from "../../assets/images/illustrations/stripe_payment.svg?react";
import UploadArtwork from "../../assets/images/illustrations/upload_artwork.svg?react";
import WorkingArtist from "../../assets/images/illustrations/working_artist.svg?react";
import MainHeading from "../../components/MainHeading";
import SwipeCard from "../../components/SwipeCard";
import SyncButton from "../../components/SyncButton";
import WizardTimeline from "../../components/WizardTimeline";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useInstructionsStyles = makeStyles((muiTheme) => ({
  heading: {
    textAlign: "center",
  },
  paragraph: {
    margin: "16px 0",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 850,
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
}));

const SELLER_ILLUSTRATIONS = [
  {
    heading: "Unleash your creativity",
    paragraph:
      "Set up your profile and work at your own pace. Start a temporary account when you are ready to try sharing your artwork.",
    illustration: <WorkingArtist />,
  },
  {
    heading: "Upload for everyone to see ",
    paragraph:
      "Share a small test image for others to enjoy. Use only artwork you have permission to share, and keep your original files elsewhere.",
    illustration: <UploadArtwork />,
  },
  {
    heading: "You're in charge",
    paragraph:
      "Fill out the information about your artwork and choose how it is displayed. Make it preview only or available for the sample collection workflow.",
    illustration: <MakeAdjustments />,
  },
  {
    heading: "Stay up to date",
    paragraph:
      "Follow interactions with your artwork through notifications while your session is active.",
    illustration: <ReceiveUpdates />,
  },
  {
    heading: "Review your artwork",
    paragraph:
      "Visit My artwork to review the pieces you have shared and make changes to their details.",
    illustration: <MonitorDashboard />,
  },
  {
    heading: "Explore the order workflow",
    paragraph:
      "See how collectors create an order for eligible artwork. Orders are simulated; payments and seller payouts are unavailable.",
    illustration: <EarnMoney />,
  },
];

const BUYER_ILLUSTRATIONS = [
  {
    heading: "Browse artwork",
    paragraph:
      "Browse the gallery and explore artists’ profiles. Start a temporary account when you want to interact with a piece.",
    illustration: <BrowseArtwork />,
  },
  {
    heading: "Interact with artists",
    paragraph:
      "Once you find something you like, favorite it, comment on it and explore more from what the artist is showcasing. Interact and stay in touch.",
    illustration: <SelectArtwork />,
  },
  {
    heading: "Make it yours",
    paragraph:
      "Once you have your eyes set on a specific piece, choose the available personal-license option and create a sample order.",
    illustration: <StripePayment />,
  },
  {
    heading: "Explore the license",
    paragraph:
      "Inspect the sample receipt and license fingerprint. These records demonstrate the workflow and grant no real usage rights.",
    illustration: <LicenseCertification />,
  },
  {
    heading: "Admire your collection",
    paragraph:
      "Head to your gallery to marvel at the art you collected and play the slideshow in fullscreen mode for complete immersion.",
    illustration: <ArtworkGallery />,
  },
  {
    heading: "View it, explore it, love it",
    paragraph:
      "Explore your collection during the session. Accounts expire after 24 hours, so keep any files you need outside the platform.",
    illustration: <DisplayCollection />,
  },
];

const HowItWorks = () => {
  const [state, setState] = useState({ tab: 0 });

  const globalClasses = globalStyles();
  const classes = useInstructionsStyles();

  const changeTab = ({ index }) => {
    setState((prevState) => ({ ...prevState, tab: index }));
  };

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MainHeading text="How it works" />
          <Typography className={classes.paragraph}>
            {`${appName} brings artists and collectors together to browse, share and collect digital art.
            Explore the workflow in six simple steps from either perspective. This version uses temporary accounts and simulated orders.`}
          </Typography>
        </Grid>
        <SwipeCard
          tabs={{
            value: state.tab,
            headings: [
              {
                display: true,
                label: "For artists",
                props: {},
              },
              {
                display: true,
                label: "For collectors",
                props: {},
              },
            ],
            items: [
              {
                display: true,
                component: (
                  <WizardTimeline illustrations={SELLER_ILLUSTRATIONS} />
                ),
                error: null,
                loading: false,
              },
              {
                display: true,
                component: (
                  <WizardTimeline illustrations={BUYER_ILLUSTRATIONS} />
                ),
                error: null,
                loading: false,
              },
            ],
          }}
          handleTabsChange={({ index }) => changeTab({ index })}
          handleChangeIndex={({ index }) => changeTab({ index })}
          loading={false}
        />
        <Grid item sm={12} className={classes.wrapper}>
          <Box className={classes.actions}>
            <Typography variant="h4" className={classes.label}>
              Want to learn more? Click on one of the buttons below
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

export default HowItWorks;
