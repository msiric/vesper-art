import { Box, Button, Card } from "@material-ui/core";
import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import PricingCard from "../../components/PricingCard/PricingCard.js";
import SwipeCard from "../../components/SwipeCard/SwipeCard.js";
import { Context } from "../../context/Store.js";
import { CardContent, Typography } from "../../styles/theme.js";

const ArtworkInfo = ({
  artwork = {},
  license = {},
  tabs = {},
  handleTabsChange,
  handleChangeIndex,
  handlePurchase,
  handleModalOpen,
  match,
  loading,
}) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  const isSeller = () => store.user.id === artwork.owner._id;

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
                  display: !!artwork.current.commercial,
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
                      artworkId={artwork._id}
                      versionId={artwork.current._id}
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
                  display: !!artwork.current.commercial,
                  iterable: false,
                  content: null,
                  component: (
                    <PricingCard
                      artworkId={artwork._id}
                      versionId={artwork.current._id}
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
                    <Box display="flex" flexDirection="column">
                      <Typography variant="subtitle1" m={2}>
                        This artwork cannot be purchased or downloaded since it
                        is preview only
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to={`/edit_artwork/${artwork._id}`}
                      >
                        Edit artwork
                      </Button>
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
