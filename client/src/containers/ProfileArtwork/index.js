import { Box, Grid, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import EmptySection from "../../components/EmptySection/index.js";
import SwipeCard from "../../components/SwipeCard/index.js";
import { useUserArtwork } from "../../contexts/local/userArtwork";
import { useUserProfile } from "../../contexts/local/userProfile";
import useOnScreen from "../../hooks/useOnScreen.js";
import globalStyles from "../../styles/global.js";
import UserArtwork from "../UserArtwork/index.js";
import UserFavorites from "../UserFavorites/index.js";
import profileArtworkStyles from "./styles.js";

const ProfileArtwork = ({ paramId, artworkRef, artworkFetched }) => {
  const profile = useUserProfile((state) => state.profile.data);
  const editable = useUserProfile((state) => state.editable);
  const tabs = useUserArtwork((state) => state.tabs);
  const artwork = useUserArtwork((state) => state.artwork.data);
  const artworkLoading = useUserArtwork((state) => state.artwork.loading);
  const favorites = useUserArtwork((state) => state.favorites.data);
  const favoritesLoading = useUserArtwork((state) => state.favorites.loading);
  const fetchArtwork = useUserArtwork((state) => state.fetchArtwork);
  const fetchFavorites = useUserArtwork((state) => state.fetchFavorites);
  const changeTab = useUserArtwork((state) => state.changeTab);

  const isVisible = useOnScreen(artworkRef, artworkFetched.current);

  const globalClasses = globalStyles();
  const classes = profileArtworkStyles();

  useEffect(() => {
    if (!artworkFetched.current && isVisible) {
      fetchArtwork({
        userUsername: paramId,
      });
      artworkFetched.current = true;
    }
  }, [isVisible]);

  useEffect(() => {
    if (!tabs.revealed && tabs.value === 1) {
      fetchFavorites({
        userUsername: paramId,
      });
    }
  }, [tabs.value]);

  return (
    <Grid item xs={12} className={classes.grid}>
      <Paper ref={artworkRef} className={classes.paper}>
        <SwipeCard
          tabs={{
            value: tabs.value,
            hasMore: "",
            type: "artwork",
            headings: [
              { display: true, label: "Artwork", props: {} },
              {
                display: profile.displayFavorites,
                label: "Favorites",
                props: {},
              },
            ],
            items: [
              {
                display: true,
                iterable: true,
                content: artwork.length,
                component: (
                  <Box
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "0 32px",
                    }}
                  >
                    <UserArtwork
                      elements={artwork}
                      hasMore={null}
                      loadMore={fetchArtwork}
                      type="artwork"
                      fixed={true}
                      loading={artworkLoading}
                    />
                  </Box>
                ),
                error: (
                  <EmptySection
                    label={
                      editable
                        ? "You have no artwork to display"
                        : "This user has no artwork to display"
                    }
                    loading={artworkLoading}
                  />
                ),
                loading: false,
              },
              {
                display: profile.displayFavorites,
                iterable: true,
                content: favorites.length,
                component: (
                  <Box
                    style={{
                      width: "100%",
                      height: "100%",
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                    className={globalClasses.gridContainer}
                  >
                    <UserFavorites
                      elements={favorites}
                      hasMore={null}
                      loadMore={fetchFavorites}
                      type="artwork"
                      fixed={true}
                      loading={favoritesLoading}
                    />
                  </Box>
                ),
                error: (
                  <EmptySection
                    label={
                      editable
                        ? "You have no favorited artwork"
                        : "This user has no favorited artwork"
                    }
                    loading={favoritesLoading}
                  />
                ),
                loading: tabs.loading,
              },
            ],
          }}
          handleTabsChange={changeTab}
          loading={artworkLoading}
        />
      </Paper>
    </Grid>
  );
};

export default ProfileArtwork;
