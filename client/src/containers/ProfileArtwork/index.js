import React, { useEffect } from "react";
import EmptySection from "../../components/EmptySection/index";
import SwipeCard from "../../components/SwipeCard/index";
import { useUserArtwork } from "../../contexts/local/userArtwork";
import { useUserProfile } from "../../contexts/local/userProfile";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import Grid from "../../domain/Grid";
import useVisibleElement from "../../hooks/useVisibleElement";
import UserArtwork from "../UserArtwork/index";
import UserFavorites from "../UserFavorites/index";
import profileArtworkStyles from "./styles";

const ProfileArtwork = ({ paramId, artworkRef, artworkFetched }) => {
  const profile = useUserProfile((state) => state.profile.data);
  const editable = useUserProfile((state) => state.editable);
  const loading = useUserProfile((state) => state.profile.loading);

  const tabs = useUserArtwork((state) => state.tabs);
  const artworkLoading = useUserArtwork((state) => state.artwork.loading);
  const favoritesLoading = useUserArtwork((state) => state.favorites.loading);
  const fetchArtwork = useUserArtwork((state) => state.fetchArtwork);
  const fetchFavorites = useUserArtwork((state) => state.fetchFavorites);
  const changeTab = useUserArtwork((state) => state.changeTab);

  const userUsername = paramId;

  const isVisible = useVisibleElement(artworkRef, artworkFetched.current);

  const classes = profileArtworkStyles();

  useEffect(() => {
    if (!artworkFetched.current && isVisible) {
      fetchArtwork({
        userUsername,
      });
      artworkFetched.current = true;
    }
  }, [isVisible]);

  useEffect(() => {
    if (!tabs.revealed && tabs.value === 1) {
      fetchFavorites({
        userUsername,
      });
    }
  }, [tabs.value]);

  return (
    <Grid item xs={12}>
      <Card ref={artworkRef} className={classes.paper}>
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
                component: (
                  <Box className={classes.wrapper}>
                    <UserArtwork
                      userUsername={userUsername}
                      type="artwork"
                      fixed
                      shouldPause={tabs.value !== 0}
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
                    loading={loading}
                  />
                ),
                loading: artworkLoading,
              },
              {
                display: profile.displayFavorites,
                component: (
                  <Box className={classes.wrapper}>
                    <UserFavorites
                      userUsername={userUsername}
                      type="favorite"
                      fixed
                      shouldPause={tabs.value !== 1}
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
                    loading={loading}
                  />
                ),
                loading: favoritesLoading,
              },
            ],
          }}
          handleTabsChange={changeTab}
          loading={loading}
        />
      </Card>
    </Grid>
  );
};

export default ProfileArtwork;
