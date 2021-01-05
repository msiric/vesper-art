import { Box, Grid, Paper } from "@material-ui/core";
import React from "react";
import EmptySection from "../../components/EmptySection/index.js";
import SwipeCard from "../../components/SwipeCard/index.js";
import ArtworkPanel from "../ArtworkPanel/index.js";
import profileArtworkStyles from "./styles.js";

const ProfileArtwork = ({
  tabs,
  user,
  loadMoreArtwork,
  loadMoreFavorites,
  handleTabsChange,
  handleChangeIndex,
  loading,
}) => {
  const classes = profileArtworkStyles();

  return (
    <Grid item xs={12} className={classes.grid}>
      <Paper className={classes.paper}>
        {user.editable ? (
          <SwipeCard
            tabs={{
              value: tabs.value,
              hasMore: "",
              type: "artwork",
              headings: [
                { display: true, label: "User artwork", props: {} },
                {
                  display: user.displayFavorites,
                  label: "Saved artwork",
                  props: {},
                },
              ],
              items: [
                {
                  display: true,
                  iterable: true,
                  content: user.artwork.length,
                  component: (
                    <Box
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "0 32px",
                      }}
                    >
                      <ArtworkPanel
                        elements={user.artwork}
                        hasMore={null}
                        loadMore={loadMoreArtwork}
                        type="artwork"
                        fixed={true}
                        loading={loading}
                      />
                    </Box>
                  ),
                  error: (
                    <EmptySection
                      label="You have no artwork to display"
                      loading={loading}
                    />
                  ),
                  loading: false,
                },
                {
                  display: user.displayFavorites,
                  iterable: true,
                  content: user.favorites.length,
                  component: (
                    <Box
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "0 32px",
                      }}
                    >
                      <ArtworkPanel
                        elements={user.favorites}
                        hasMore={null}
                        loadMore={loadMoreFavorites}
                        type="artwork"
                        fixed={true}
                        loading={loading}
                      />
                    </Box>
                  ),
                  error: (
                    <EmptySection
                      label="You have no favorited artwork"
                      loading={loading}
                    />
                  ),
                  loading: tabs.loading,
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
            loading={loading}
          />
        ) : (
          <SwipeCard
            tabs={{
              value: tabs.value,
              hasMore: "",
              headings: [
                { display: true, label: "User artwork", props: {} },
                {
                  display: user.displayFavorites,
                  label: "Saved artwork",
                  props: {},
                },
              ],
              items: [
                {
                  display: true,
                  iterable: true,
                  content: user.artwork.length,
                  component: (
                    <Box
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "0 32px",
                      }}
                    >
                      <ArtworkPanel
                        elements={user.artwork}
                        hasMore={null}
                        loadMore={loadMoreArtwork}
                        type="artwork"
                        fixed={true}
                        loading={loading}
                      />
                    </Box>
                  ),
                  error: (
                    <EmptySection
                      label="This user has no artwork to display"
                      loading={loading}
                    />
                  ),
                  loading: false,
                },
                {
                  display: user.displayFavorites,
                  iterable: true,
                  content: user.favorites.length,
                  component: (
                    <Box
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "0 32px",
                      }}
                    >
                      <ArtworkPanel
                        elements={user.favorites}
                        hasMore={null}
                        loadMore={loadMoreFavorites}
                        type="artwork"
                        fixed={true}
                        loading={loading}
                      />
                    </Box>
                  ),
                  error: (
                    <EmptySection
                      label="This user has no favorited artwork"
                      loading={loading}
                    />
                  ),
                  loading: tabs.loading,
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
            loading={loading}
          />
        )}
      </Paper>
    </Grid>
  );
};

export default ProfileArtwork;
