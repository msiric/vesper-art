import React, { useEffect } from "react";
import ProfileBanner from "../../components/ProfileBanner/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useUserProfile } from "../../contexts/local/userProfile";
import Grid from "../../domain/Grid";
import profileInfoStyles from "./styles.js";

const ProfileInfo = ({ paramId }) => {
  const userId = useUserStore((state) => state.id);
  const profile = useUserProfile((state) => state.profile.data);
  const loading = useUserProfile((state) => state.profile.loading);
  const fetchProfile = useUserProfile((state) => state.fetchProfile);
  const classes = profileInfoStyles();

  useEffect(() => {
    fetchProfile({ userUsername: paramId, userId });
  }, []);

  return (
    <Grid item xs={12}>
      <ProfileBanner profile={profile} loading={loading} />
    </Grid>
  );
};

export default ProfileInfo;
