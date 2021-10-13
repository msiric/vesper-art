import {
  AssignmentTurnedInOutlined as VerifyIcon,
  ExitToAppOutlined as SignupIcon,
  InfoOutlined as InfoIcon,
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import HelpBox from "../../components/HelpBox";
import SyncButton from "../../components/SyncButton";
import { useUserStore } from "../../contexts/global/user";
import { useHomeArtwork } from "../../contexts/local/homeArtwork";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import homeBannerStyles from "./styles";

const HomeBanner = () => {
  const authenticated = useUserStore((state) => state.authenticated);

  const barVisible = useHomeArtwork((state) => state.bar.visible);
  const barMessage = useHomeArtwork((state) => state.bar.message);
  const wrapperVisible = useHomeArtwork((state) => state.wrapper.visible);
  const wrapperMessage = useHomeArtwork((state) => state.wrapper.message);
  const setBar = useHomeArtwork((state) => state.setBar);
  const setWrapper = useHomeArtwork((state) => state.setWrapper);
  const fetchArtwork = useHomeArtwork((state) => state.fetchArtwork);

  useEffect(() => {
    fetchArtwork();
    setBar();
    setWrapper();
  }, []);

  const classes = homeBannerStyles();

  return [
    <Grid item xs={12} md={9}>
      {barVisible && (
        <HelpBox type="alert" label={barMessage} margin="0 0 12px 0" />
      )}
      <Card className={classes.banner}>
        {wrapperVisible && (
          <Box className={classes.beta}>
            <Typography className={classes.message}>
              {wrapperMessage}
            </Typography>
          </Box>
        )}
        <CardContent className={classes.content}>
          <Box className={classes.wrapper}>
            <Typography className={classes.bannerHeading}>
              Browse, share and collect digital art the way it's intended to be
              done
            </Typography>
          </Box>
          <Box className={classes.bannerActions}>
            {!authenticated && (
              <SyncButton
                component={RouterLink}
                to="/signup"
                className={classes.bannerButton}
                startIcon={<SignupIcon />}
              >
                Sign up
              </SyncButton>
            )}
            <SyncButton
              component={RouterLink}
              to="/how_it_works"
              color="default"
              className={classes.bannerButton}
              startIcon={<InfoIcon />}
            >
              How it works
            </SyncButton>
          </Box>
        </CardContent>
      </Card>
    </Grid>,
    <Grid item xs={12} md={3}>
      <Card className={classes.verifier}>
        <CardContent className={classes.content}>
          <Box className={classes.wrapper}>
            <Typography className={classes.verifierHeading}>
              Need to verify a license?
            </Typography>
            <Typography className={classes.verifierText}>
              Head to the platform's verifier
            </Typography>
          </Box>
          <Box className={classes.verifierButton}>
            <SyncButton
              component={RouterLink}
              to="/verifier"
              variant="outlined"
              startIcon={<VerifyIcon />}
            >
              Verify license
            </SyncButton>
          </Box>
        </CardContent>
      </Card>
    </Grid>,
  ];
};

export default HomeBanner;
