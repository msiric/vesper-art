import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  appName,
  featureFlags,
  unavailableMessage,
} from "../../../../common/constants";
import { ReactComponent as ArtworkGallery } from "../../assets/images/illustrations/artwork_gallery.svg";
import { ReactComponent as BrowseArtwork } from "../../assets/images/illustrations/browse_artwork.svg";
import { ReactComponent as DisplayCollection } from "../../assets/images/illustrations/display_collection.svg";
import { ReactComponent as EarnMoney } from "../../assets/images/illustrations/earn_money.svg";
import { ReactComponent as LicenseCertification } from "../../assets/images/illustrations/license_certification.svg";
import { ReactComponent as MakeAdjustments } from "../../assets/images/illustrations/make_adjustments.svg";
import { ReactComponent as MonitorDashboard } from "../../assets/images/illustrations/monitor_dashboard.svg";
import { ReactComponent as ReceiveUpdates } from "../../assets/images/illustrations/receive_updates.svg";
import { ReactComponent as SelectArtwork } from "../../assets/images/illustrations/select_artwork.svg";
import { ReactComponent as StripePayment } from "../../assets/images/illustrations/stripe_payment.svg";
import { ReactComponent as UploadArtwork } from "../../assets/images/illustrations/upload_artwork.svg";
import { ReactComponent as WorkingArtist } from "../../assets/images/illustrations/working_artist.svg";
import HelpBox from "../../components/HelpBox";
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
      "Set up your profile and work at your own pace. If and when you're ready, go through the onboarding process and you can start earning money from your art.",
    illustration: <WorkingArtist />,
  },
  {
    heading: "Upload for everyone to see ",
    paragraph:
      "Share your artwork on the platform for others to enjoy while never having to worry about it being stolen or used without your permission.",
    illustration: <UploadArtwork />,
  },
  {
    heading: "You're in charge",
    paragraph:
      "Fill out the information about your artwork and the licenses you will be offering. You have full control and freedom to adjust everything to your liking.",
    illustration: <MakeAdjustments />,
  },
  {
    heading: "Stay up to date",
    paragraph:
      "Every time someone comments, downloads, purchases or leaves a rating on your artwork, you will be notified. You'll never miss a thing.",
    illustration: <ReceiveUpdates />,
  },
  {
    heading: "Track your progress",
    paragraph:
      "Visit your dashboard to monitor every sale you made, every license you issued and every event that happened at a given time.",
    illustration: <MonitorDashboard />,
  },
  {
    heading: "Get payed for your work",
    paragraph:
      "All the transactions are securely processed by Stripe and reliably kept in your account balance for you to transfer to a destination of your choice.",
    illustration: <EarnMoney />,
  },
];

const BUYER_ILLUSTRATIONS = [
  {
    heading: "Browse artwork",
    paragraph:
      "Sign up and browse the diverse collection of artwork from our talented artists. There's something for everyone.",
    illustration: <BrowseArtwork />,
  },
  {
    heading: "Select art of your choosing",
    paragraph:
      "Once you find something you like, favorite it, comment on it and explore more from that artist. Interact and stay in touch.",
    illustration: <SelectArtwork />,
  },
  {
    heading: "Make it yours",
    paragraph:
      "Once you have your eyes on a specific piece, choose a license and download/purchase it, depending on what the artist is offering.",
    illustration: <StripePayment />,
  },
  {
    heading: "Keep it yours",
    paragraph:
      "Every download/purchase comes with a license that proves your ownership of the artwork and the order that was placed to acquire it.",
    illustration: <LicenseCertification />,
  },
  {
    heading: "Admire your collection",
    paragraph:
      "Head to your gallery at any time to enjoy the art that you own and play the slideshow in fullscreen mode for complete immersion.",
    illustration: <ArtworkGallery />,
  },
  {
    heading: "Share it, show it, love it",
    paragraph:
      "You can download your artwork on as many devices as you want and access it at anytime from anywhere, knowing that your ownership cannot be disputed.",
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
      <Grid container>
        <Grid item sm={12}>
          {!featureFlags.stripe && (
            <HelpBox
              type="alert"
              label={unavailableMessage}
              margin="0 0 12px 0"
            />
          )}
          <MainHeading text="How it works" />
          <Typography className={classes.paragraph}>
            {`${appName} is a digital art marketplace that allows art lovers to view, download and purchase art from other artists while protecting both sides 
            by utilizing a system based on licenses as a means of transparency and non-repudiation while maintaining user anonymity.
            Get up to speed with how ${appName} works in six simple steps from the perspective of both parties involved`}
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
                iterable: false,
                content: null,
                component: (
                  <WizardTimeline illustrations={SELLER_ILLUSTRATIONS} />
                ),
                error: null,
                loading: false,
              },
              {
                display: true,
                iterable: false,
                content: null,
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
                component={RouterLink}
                to="/start_selling"
                color="secondary"
              >{`Selling on ${appName}`}</SyncButton>
              <SyncButton
                component={RouterLink}
                to="/start_buying"
              >{`Buying on ${appName}`}</SyncButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HowItWorks;
