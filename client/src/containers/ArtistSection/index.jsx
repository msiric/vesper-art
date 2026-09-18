import React from "react";
import ProfileCard from "../../components/ProfileCard/index";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";

const ArtistSection = () => {
  const owner = useArtworkDetails((state) => state.artwork.data.owner);
  const loading = useArtworkDetails((state) => state.artwork.loading);

  return <ProfileCard user={owner} loading={loading} />;
};

export default ArtistSection;
