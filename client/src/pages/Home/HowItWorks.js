import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as ArtworkGallery } from "../../assets/illustrations/artwork_gallery.svg";
import { ReactComponent as BrowseArtwork } from "../../assets/illustrations/browse_artwork.svg";
import { ReactComponent as DisplayCollection } from "../../assets/illustrations/display_collection.svg";
import { ReactComponent as EarnMoney } from "../../assets/illustrations/earn_money.svg";
import { ReactComponent as LicenseCertification } from "../../assets/illustrations/license_certification.svg";
import { ReactComponent as MakeAdjustments } from "../../assets/illustrations/make_adjustments.svg";
import { ReactComponent as MonitorDashboard } from "../../assets/illustrations/monitor_dashboard.svg";
import { ReactComponent as ReceiveUpdates } from "../../assets/illustrations/receive_updates.svg";
import { ReactComponent as SelectArtwork } from "../../assets/illustrations/select_artwork.svg";
import { ReactComponent as StripePayment } from "../../assets/illustrations/stripe_payment.svg";
import { ReactComponent as UploadArtwork } from "../../assets/illustrations/upload_artwork.svg";
import { ReactComponent as WorkingArtist } from "../../assets/illustrations/working_artist.svg";
import IllustrationCard from "../../components/IllustrationCard";
import globalStyles from "../../styles/global.js";

const SELLER_ILLUSTRATIONS = [
  {
    heading: "Unleash your creativity",
    paragraph:
      "Set up your profile and work at your own pace. If and when you're ready, go through the onboarding process and you can start earning money from your art. It's that simple.",
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
      <Grid container>
        <Grid item sm={12}>
          <Typography>How it works</Typography>
        </Grid>
        <Grid item sm={12} md={6}>
          {SELLER_ILLUSTRATIONS.map((item) => (
            <IllustrationCard
              heading={item.heading}
              paragraph={item.paragraph}
              illustration={item.illustration}
            />
          ))}
        </Grid>
        <Grid item sm={12} md={6}>
          {BUYER_ILLUSTRATIONS.map((item) => (
            <IllustrationCard
              heading={item.heading}
              paragraph={item.paragraph}
              illustration={item.illustration}
            />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default HowItWorks;
