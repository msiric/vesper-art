import { Box, Button, Card } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import shallow from "zustand/shallow";
import PricingCard from "../../components/PricingCard/index.js";
import SwipeCard from "../../components/SwipeCard/index.js";
import { useTracked as useUserContext } from "../../contexts/global/User.js";
import { useArtworkStore } from "../../contexts/local/Artwork";
import { CardContent, Typography } from "../../styles/theme.js";
import artworkInfoStyles from "./styles.js";

const ArtworkInfo = () => {
  const { artwork, license, loading } = useArtworkStore(
    (state) => ({
      artwork: state.artwork.data,
      license: state.license,
      loading: state.artwork.loading,
    }),
    shallow
  );
  const [userStore] = useUserContext();
  const classes = artworkInfoStyles();

  const isSeller = () => userStore.id === artwork.owner.id;

  let tabs = { value: 0 };
  let handlePurchase;
  let handleModalClose;
  let handleModalOpen;
  let handleTabsChange;
  let handleChangeIndex;

  return (
    <Card className={classes.root} loading={loading}>
      <CardContent pt={0} pb={0}>
        {artwork.current && artwork.current.availability === "available" ? (
          <SwipeCard
            tabs={{
              value: tabs.value,
              headings: [
                {
                  display: artwork.current.use !== "included",
                  label: "Personal license",
                  props: {},
                },
                {
                  display: artwork.current.license === "commercial",
                  label: "Commercial license",
                  props: {},
                },
              ],
              items: [
                {
                  display: artwork.current.use !== "included",
                  iterable: false,
                  content: null,
                  component: (
                    <PricingCard
                      artworkId={artwork.id}
                      versionId={artwork.current.id}
                      price={artwork.current.personal}
                      isSeller={isSeller}
                      heading="Personal license. Use for personal projects, social media, and
                  non commercial activities"
                      list={[]}
                      license="personal"
                      handlePurchase={handlePurchase}
                      handleModalOpen={handleModalOpen}
                    />
                  ),
                  error: null,
                  loading: loading,
                },
                {
                  display: artwork.current.license === "commercial",
                  iterable: false,
                  content: null,
                  component: (
                    <PricingCard
                      artworkId={artwork.id}
                      versionId={artwork.current.id}
                      price={artwork.current.commercial}
                      isSeller={isSeller}
                      heading="Commercial license. Use anywhere in the world for unlimited projects with no expiration dates"
                      list={[]}
                      license="commercial"
                      handlePurchase={handlePurchase}
                      handleModalOpen={handleModalOpen}
                    />
                  ),
                  error: null,
                  loading: loading,
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
            margin="0px -16px"
            loading={loading}
          />
        ) : (
          <SwipeCard
            tabs={{
              value: tabs.value,
              headings: [
                {
                  display: true,
                  label: "Preview only",
                  props: {},
                },
              ],
              items: [
                {
                  display: true,
                  iterable: false,
                  content: null,
                  component: (
                    <Box
                      display="flex"
                      flexDirection="column"
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Typography variant="subtitle1" m={2}>
                        This artwork cannot be purchased or downloaded since it
                        is preview only
                      </Typography>
                      {!loading && isSeller() && (
                        <Button
                          variant="outlined"
                          color="primary"
                          component={RouterLink}
                          to={`/artwork/${artwork.id}/edit`}
                        >
                          Edit artwork
                        </Button>
                      )}
                    </Box>
                  ),
                  error: null,
                  loading: loading,
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
            margin="0px -16px"
            loading={loading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ArtworkInfo;
