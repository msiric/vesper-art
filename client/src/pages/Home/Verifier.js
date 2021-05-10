import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { LabelImportant as ItemIcon } from "@material-ui/icons";
import { withSnackbar } from "notistack";
import React, { useEffect } from "react";
import { ReactComponent as VerifyLicense } from "../../assets/images/illustrations/verify_license.svg";
import IllustrationCard from "../../components/IllustrationCard";
import SkeletonWrapper from "../../components/SkeletonWrapper";
import LicenseSection from "../../containers/LicenseSection/index.js";
import VerifierCard from "../../containers/VerifierCard/index.js";
import { useLicenseVerifier } from "../../contexts/local/licenseVerifier";
import globalStyles from "../../styles/global.js";
import { artepunktTheme } from "../../styles/theme";

const Verifier = () => {
  const resetToken = useLicenseVerifier((state) => state.resetToken);

  const globalClasses = globalStyles();

  const reinitializeState = () => {
    resetToken();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <VerifierCard />
          <br />
          <LicenseSection />
        </Grid>
        <Grid item xs={12} md={5}>
          <IllustrationCard
            heading="Verify your license"
            paragraph="Make sure it's used by the right person"
            body={
              <List
                component="nav"
                aria-label="Features"
                style={{ width: "100%", marginTop: 20 }}
                disablePadding
              >
                <ListItem>
                  <SkeletonWrapper variant="text" style={{ marginRight: 10 }}>
                    <ListItemIcon>
                      <ItemIcon />
                    </ListItemIcon>
                  </SkeletonWrapper>
                  <SkeletonWrapper variant="text">
                    <ListItemText primary="Enter license fingerprint" />
                  </SkeletonWrapper>
                </ListItem>
                <ListItem>
                  <SkeletonWrapper variant="text" style={{ marginRight: 10 }}>
                    <ListItemIcon>
                      <ItemIcon />
                    </ListItemIcon>
                  </SkeletonWrapper>
                  <SkeletonWrapper variant="text">
                    <ListItemText primary="Get back license information" />
                  </SkeletonWrapper>
                </ListItem>
                <ListItem>
                  <SkeletonWrapper variant="text" style={{ marginRight: 10 }}>
                    <ListItemIcon>
                      <ItemIcon />
                    </ListItemIcon>
                  </SkeletonWrapper>
                  <SkeletonWrapper variant="text">
                    <ListItemText primary="Verify data" />
                  </SkeletonWrapper>
                </ListItem>
              </List>
            }
            illustration={<VerifyLicense style={{ width: "60%" }} />}
            style={{
              background: artepunktTheme.palette.background.paper,
              padding: 24,
              margin: 0,
              borderRadius: artepunktTheme.shape.borderRadius,
              boxShadow:
                "0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)",
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default withSnackbar(Verifier);
