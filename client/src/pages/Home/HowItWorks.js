import { Button, Card, Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { appName } from "../../../../common/constants";
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
import IllustrationCard from "../../components/IllustrationCard";
import MainHeading from "../../components/MainHeading";
import globalStyles from "../../styles/global.js";

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
  const globalClasses = globalStyles();

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <MainHeading text="How it works" />
          <Typography>
            {`${appName} is a digital art marketplace that allows art lovers to view, download and purchase art from other artists while protecting both sides 
            by utilizing a system based on licenses as a means of transparency and non-repudiation while maintaining user anonymity.
            Get up to speed with how ${appName} works in six simple steps from the perspective of both parties involved`}
          </Typography>
        </Grid>
        <Grid item sm={12} md={6}>
          <Card>
            <MainHeading text="Sellers" style={{ textAlign: "center" }} />
            {SELLER_ILLUSTRATIONS.map((item) => (
              <IllustrationCard
                heading={item.heading}
                paragraph={item.paragraph}
                illustration={item.illustration}
              />
            ))}
          </Card>
        </Grid>
        <Grid item sm={12} md={6}>
          <Card>
            <MainHeading text="Buyers" style={{ textAlign: "center" }} />
            {BUYER_ILLUSTRATIONS.map((item) => (
              <IllustrationCard
                heading={item.heading}
                paragraph={item.paragraph}
                illustration={item.illustration}
              />
            ))}
          </Card>
        </Grid>
        <Grid item sm={12}>
          <Typography>Join the platform and get started</Typography>
          <Button variant="outlined">Sign up</Button>
          <Typography>
            Want to learn more? Click on one of the pages below
          </Typography>
          <Button variant="outlined">{`Selling on ${appName}`}</Button>
          <Button variant="outlined">{`Buying on ${appName}`}</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HowItWorks;
