import { makeStyles } from "@material-ui/core";
import { ShoppingBasketOutlined as BuyingIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  appName,
  featureFlags,
  unavailableMessage,
} from "../../../../common/constants";
import HelpBox from "../../components/HelpBox";
import SyncButton from "../../components/SyncButton";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";

const useAboutStyling = makeStyles((muiTheme) => ({
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

const About = () => {
  const globalClasses = globalStyles();
  const classes = useAboutStyling();

  return (
    <Container
      className={`${globalClasses.gridContainer} ${globalClasses.smallContainer}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {
            // FEATURE FLAG - stripe
            !featureFlags.stripe && (
              <HelpBox
                type="alert"
                label={unavailableMessage}
                margin="0 0 12px 0"
              />
            )
          }
          <Typography variant="h4">{`What is ${appName}`}</Typography>
          <Typography className={classes.paragraph}>
            {`${appName} is on a mission to transform the way artists upload, showcase and sell their artwork. 
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Signing up to ${appName} is free and unlocks all the benefits of using the platform. 
            As an artist, you have the option to upload your artwork and be in full control of how it is displayed and interacted with. 
            You can make your artwork „preview only“ which, as the name suggests, allows users to only preview your art without downloading or purchasing it. 
            Another option is to make your artwork „available for download“, but fine-tune the details regarding the personal and commercial licenses. 
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`You can charge these licenses separately or choose to offer one without the other. In order to start charging for your artworks' licenses, you need to go through the onboarding process. 
            This will redirect you to Stripe, ${appName}'s payment processing partner, that ensures you and your funds are properly secured and protected. After the onboarding process, your Stripe account is linked to your ${appName} account and you're ready to start charging money for your artworks' licenses.
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`As a collector, you can interact with your favorite artists, explore new artwork and download/purchase existing artwork, depending on the available options. 
            When you select a license and download/purchase an artwork from a certain artist, you are issued a license that proves the authenticity of your order and specifies what you are allowed and not allowed to do with it. 
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`A license fingerprint that comes with your license can be used to validate your order and provide basic information about the license. 
            If needed, you can use your assignee identifier to display additional information about the personal information contained inside the license. Make sure to keep your identifiers safe since they reveal sensitive order information. 
            `}
          </Typography>
          <Typography className={classes.paragraph}>
            {`Thanks to this system, every artwork you ever downloaded/purchased is yours to use within the license's permissions and allows you to freely download the artwork on as many devices as you want as long as you are the one using it.
            If any disputes arise from either the artist's or collector's side, it can quickly and securely be resolved by verifying the license information from both parties involved by using ${appName}'s verifier system.
            `}
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

export default About;
