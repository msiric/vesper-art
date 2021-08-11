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
  const artwork = useUserArtwork((state) => state.artwork.data);
  const artworkLoading = useUserArtwork((state) => state.artwork.loading);
  const favorites = useUserArtwork((state) => state.favorites.data);
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
                iterable: true,
                content: artwork.length,
                component: (
                  <Box className={classes.wrapper}>
                    <UserArtwork
                      userUsername={userUsername}
                      type="artwork"
                      fixed={true}
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
                loading: false,
              },
              {
                display: profile.displayFavorites,
                iterable: true,
                content: favorites.length,
                component: (
                  <Box className={classes.wrapper}>
                    <UserFavorites
                      userUsername={userUsername}
                      type="favorite"
                      fixed={true}
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
                loading: tabs.loading,
              },
            ],
          }}
          handleTabsChange={changeTab}
          loading={loading || artworkLoading}
        />
      </Card>
    </Grid>
  );
};

export default ProfileArtwork;
