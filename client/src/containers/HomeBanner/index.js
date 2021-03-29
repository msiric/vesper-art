import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useUserStore } from "../../contexts/global/user.js";
import { useHomeArtwork } from "../../contexts/local/homeArtwork";
import homeBannerStyles from "./styles";

const HomeBanner = () => {
  const authenticated = useUserStore((state) => state.authenticated);
  const fetchArtwork = useHomeArtwork((state) => state.fetchArtwork);

  useEffect(() => {
    fetchArtwork();
  }, []);

  const classes = homeBannerStyles();

  return [
    <Grid item xs={12} md={9}>
      <Card className={classes.bannerContainer}>
        <CardContent
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginBottom: 16,
              padding: 16,
            }}
          >
            <Typography
              style={{
                textAlign: "center",
                fontSize: 24,
                fontWeight: "bold",
                width: "60%",
              }}
            >
              Browse, share and collect digital art the way it's intended to be
              done
            </Typography>
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {!authenticated && (
              <Button
                component={RouterLink}
                to="/signup"
                style={{ margin: "0 6px" }}
              >
                Sign up
              </Button>
            )}
            <Button
              component={RouterLink}
              to="/how_it_works"
              color="default"
              style={{ margin: "0 6px" }}
            >
              How it works
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>,
    <Grid item xs={12} md={3}>
      <Card
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "0 32px",
        }}
      >
        <CardContent
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginBottom: 16,
              padding: 16,
            }}
          >
            <Typography style={{ textAlign: "center" }}>
              Need to verify a license? Head to the platform's verifier
            </Typography>
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button component={RouterLink} to="/verifier" variant="outlined">
              Verify license
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>,
  ];
};

export default HomeBanner;
