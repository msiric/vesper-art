import { makeStyles } from "@material-ui/core";
import { LabelImportant as ItemIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as VerifyLicense } from "../../assets/images/illustrations/verify_license.svg";
import IllustrationCard from "../../components/IllustrationCard";
import ListItems from "../../components/ListItems";
import LicenseSection from "../../containers/LicenseSection/index";
import VerifierCard from "../../containers/VerifierCard/index";
import { useLicenseVerifier } from "../../contexts/local/licenseVerifier";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Link from "../../domain/Link";
import globalStyles from "../../styles/global";
import { artepunktTheme } from "../../styles/theme";

const useVerifierStyles = makeStyles((muiTheme) => ({
  list: {
    width: "100%",
    marginTop: 20,
  },
  illustration: {
    width: "60%",
  },
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    background: artepunktTheme.palette.background.paper,
    padding: 24,
    margin: 0,
    borderRadius: muiTheme.shape.borderRadius,
    boxShadow:
      "0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)",
  },
}));

const Verifier = () => {
  const retry = useLicenseVerifier((state) => state.license.error.retry);
  const redirect = useLicenseVerifier((state) => state.license.error.redirect);
  const message = useLicenseVerifier((state) => state.license.error.message);
  const resetToken = useLicenseVerifier((state) => state.resetToken);

  const globalClasses = globalStyles();
  const classes = useVerifierStyles();

  const verifierOptions = [
    {
      icon: <ItemIcon />,
      label: "Enter license fingerprint to get back basic license information",
    },
    {
      icon: <ItemIcon />,
      label:
        "Enter the assignee/assignor identifier to get back detailed information",
    },
    { icon: <ItemIcon />, label: "Verify the validity of the license" },
  ];

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
          <Box className={globalClasses.bottomSpacing}>
            <VerifierCard />
          </Box>
          <LicenseSection />
        </Grid>
        <Grid item xs={12} md={5}>
          <IllustrationCard
            heading="Verify your license"
            paragraph="Make sure it's used by the right person"
            body={
              <Box>
                <ListItems className={classes.list} items={verifierOptions} />
                <Link
                  component={RouterLink}
                  to="/how_it_works"
                  variant="body2"
                  color="primary"
                >
                  Learn more
                </Link>
              </Box>
            }
            illustration={<VerifyLicense className={classes.illustration} />}
            className={classes.card}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Verifier;
