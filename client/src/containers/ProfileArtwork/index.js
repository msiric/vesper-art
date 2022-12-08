import { useUserStore } from "@contexts/global/user";
import React, { useEffect } from "react";
import EmptySection from "../../components/EmptySection/index";
import SwipeCard from "../../components/SwipeCard/index";
import { useUserArtwork } from "../../contexts/local/userArtwork";
import { useUserProfile } from "../../contexts/local/userProfile";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import Grid from "../../domain/Grid";
import { useVisibleElement } from "../../hooks/useVisibleElement";
import UserArtwork from "../UserArtwork/index";
import UserFavorites from "../UserFavorites/index";
import profileArtworkStyles from "./styles";

const ProfileArtwork = ({ paramId, artworkRef, artworkFetched }) => {
  const userUsername = useUserStore((state) => state.name);

  const profile = useUserProfile((state) => state.profile.data);
  const editable = useUserProfile((state) => state.editable);
  const loading = useUserProfile((state) => state.profile.loading);

  const tabs = useUserArtwork((state) => state.tabs);
  const artworkLoading = useUserArtwork((state) => state.artwork.loading);
  const favoritesLoading = useUserArtwork((state) => state.favorites.loading);
  const fetchArtwork = useUserArtwork((state) => state.fetchArtwork);
  const fetchFavorites = useUserArtwork((state) => state.fetchFavorites);
  const changeTab = useUserArtwork((state) => state.changeTab);

  const profileUsername = paramId;

  const isVisible = useVisibleElement(artworkRef, artworkFetched.current);
  const isOwner = !profile.displayFavorites && profileUsername === userUsername;
  const shouldDisplayFavorites =
    profile.displayFavorites || profileUsername === userUsername;

  const classes = profileArtworkStyles();

  useEffect(() => {
    if (!artworkFetched.current && isVisible && !artworkLoading) {
      fetchArtwork({
        userUsername: profileUsername,
      });
      artworkFetched.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    if (!tabs.revealed && tabs.value === 1) {
      fetchFavorites({
        userUsername: profileUsername,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs.value, tabs.revealed]);

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
                display: shouldDisplayFavorites,
                label: isOwner ? "Favorites*" : "Favorites",
                props: {},
              },
            ],
            items: [
              {
                display: true,
                component: (
                  <Box className={classes.wrapper}>
                    <UserArtwork
                      userUsername={profile.name}
                      shouldPause={tabs.value !== 0}
                      type="artwork"
                      fixed
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
                display: shouldDisplayFavorites,
                component: (
                  <Box className={classes.wrapper}>
                    <UserFavorites
                      userUsername={profile.name}
                      shouldPause={tabs.value !== 1}
                      type="favorite"
                      fixed
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
