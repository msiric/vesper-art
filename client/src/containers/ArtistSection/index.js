import React from "react";
import { withRouter } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard/index.js";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import artistSectionStyles from "./styles.js";

const ArtistSection = () => {
  const owner = useArtworkDetails((state) => state.artwork.data.owner);
  const loading = useArtworkDetails((state) => state.artwork.loading);

  const classes = artistSectionStyles();

  return <ProfileCard user={owner} loading={loading} />;
};

export default withRouter(ArtistSection);
