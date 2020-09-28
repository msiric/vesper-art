import { Box, Divider } from "@material-ui/core";
import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import PricingCard from "../../components/PricingCard/PricingCard.js";
import SwipeCard from "../../components/SwipeCard/SwipeCard.js";
import { Card, CardContent, Typography } from "../../constants/theme.js";
import { Context } from "../../context/Store.js";

const ArtworkInfo = ({
  artwork,
  license,
  tabs,
  handleTabsChange,
  handleChangeIndex,
  handlePurchase,
  handleModalOpen,
  match,
}) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  const isSeller = () => store.user.id === artwork.owner._id;

  return (
    <Card className={classes.root}>
      <CardContent pt={0} pb={0}>
        {artwork.current.availability === "available" ? (
          /*           <>
            <Typography variant="body2" component="p" align="center">
              Artwork price:
              {artwork.current.personal
                ? ` $${artwork.current.personal}`
                : ' Free'}
            </Typography>
            <Typography variant="body2" component="p" align="center">
              Commercial license:
              {artwork.current.commercial
                ? ` $${artwork.current.commercial}`
                : artwork.current.personal
                ? ` $${artwork.current.personal}`
                : ' Free'}
            </Typography>
          </> */
          <SwipeCard
            tabs={{
              value: tabs.value,
              headings: [
                { display: true, label: "Personal license", props: {} },
                { display: true, label: "Commercial license", props: {} },
              ],
              items: [
                {
                  display: true,
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
                  loading: false,
                },
                {
                  display: true,
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
                  loading: false,
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
            margin="0px -16px"
          />
        ) : (
          [
            <Box alignItems="flex-end">
              <Typography fontSize={36} align="center">
                Preview only
              </Typography>
            </Box>,
            <Divider />,
            <Box display="flex" flexDirection="column">
              <Typography variant="subtitle1" m={2}>
                This artwork cannot be purchased or downloaded since it is
                preview only
              </Typography>
            </Box>,
          ]
        )}
      </CardContent>

      {/*       <CardActions>
        {artwork.owner._id !== store.user.id ? (
          artwork.current.availability === 'available' ? (
            license === 'personal' ? (
              artwork.current.personal ? (
                store.user.cart[artwork._id] ? (
                  <Button component={Link} to={'/cart/'}>
                    In cart
                  </Button>
                ) : (
                  <Button component={Link} to={`/checkout/${match.params.id}`}>
                    Continue
                  </Button>
                )
              ) : (
                <Button onClick={() => handleDownload(artwork.current._id)}>
                  Download
                </Button>
              )
            ) : artwork.current.personal || artwork.current.commercial ? (
              <Button component={Link} to={`/checkout/${match.params.id}`}>
                Continue
              </Button>
            ) : (
              <Button onClick={() => handleDownload(artwork.current._id)}>
                Download
              </Button>
            )
          ) : (
            <Button disabled={true}>Unavailable</Button>
          )
        ) : (
          <Button component={Link} to={`/edit_artwork/${artwork._id}`}>
            Edit artwork
          </Button>
        )}
      </CardActions>
     */}
    </Card>
  );
};

export default withRouter(ArtworkInfo);
