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
    paragraph: "",
    illustration: <WorkingArtist />,
  },
  {
    heading: "Upload for everyone to see ",
    paragraph: "",
    illustration: <UploadArtwork />,
  },
  {
    heading: "You're in charge",
    paragraph:
      "Fill out the information about your artwork and the licenses you will be offering. It's all up to you.",
    illustration: <MakeAdjustments />,
  },
  {
    heading: "Stay up to date",
    paragraph:
      "Every time someone comments, downloads, purchases or leaves a rating on your artwork, you will be notified",
    illustration: <ReceiveUpdates />,
  },
  {
    heading: "Track your progress",
    paragraph: "Visit your dashboard to  ",
    illustration: <MonitorDashboard />,
  },
  {
    heading: "Get payed for your work",
    paragraph: "",
    illustration: <EarnMoney />,
  },
];

const BUYER_ILLUSTRATIONS = [
  { heading: "Browse artwork", paragraph: "", illustration: <BrowseArtwork /> },
  {
    heading: "Pick something you like",
    paragraph: "",
    illustration: <SelectArtwork />,
  },
  { heading: "Make it yours", paragraph: "", illustration: <StripePayment /> },
  {
    heading: "Keep it yours",
    paragraph: "",
    illustration: <LicenseCertification />,
  },
  {
    heading: "Admire your collection",
    paragraph: "",
    illustration: <ArtworkGallery />,
  },
  {
    heading: "Share it, show it, love it",
    paragraph: "",
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
