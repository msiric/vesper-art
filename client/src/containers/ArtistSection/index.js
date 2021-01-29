import React from "react";
import { withRouter } from "react-router-dom";
import shallow from "zustand/shallow";
import ProfileCard from "../../components/ProfileCard/index.js";
import { useArtworkStore } from "../../contexts/local/Artwork";
import artistSectionStyles from "./styles.js";

const ArtistSection = () => {
  const { owner, loading } = useArtworkStore(
    (state) => ({
      owner: state.artwork.data.owner,
      loading: state.artwork.loading,
    }),
    shallow
  );
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
