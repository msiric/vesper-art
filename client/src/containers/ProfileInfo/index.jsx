import React, { useEffect } from "react";
import ProfileBanner from "../../components/ProfileBanner/index";
import { useUserStore } from "../../contexts/global/user";
import { useUserProfile } from "../../contexts/local/userProfile";
import Grid from "../../domain/Grid";

const ProfileInfo = ({ paramId }) => {
  const userId = useUserStore((state) => state.id);
  const profile = useUserProfile((state) => state.profile.data);
  const loading = useUserProfile((state) => state.profile.loading);
  const fetchProfile = useUserProfile((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile({ userUsername: paramId, userId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, paramId]);

  return (
    <Grid item xs={12}>
      <ProfileBanner profile={profile} loading={loading} />
    </Grid>
  );
};

export default ProfileInfo;
