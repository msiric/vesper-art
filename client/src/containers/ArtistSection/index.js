import React from "react";
import { withRouter } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard/index.js";
import { useArtworkStore } from "../../contexts/local/artwork";
import artistSectionStyles from "./styles.js";

const ArtistSection = () => {
  const owner = useArtworkStore((state) => state.artwork.data.owner);
  const loading = useArtworkStore((state) => state.artwork.loading);

  const classes = artistSectionStyles();

  return (
    <ProfileCard
      user={owner}
      handleModalOpen={null}
      height={410}
      loading={loading}
    />
  );
};

export default withRouter(ArtistSection);
