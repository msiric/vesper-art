import React from "react";
import { withRouter } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard/index.js";
import artistSectionStyles from "./styles.js";

const ArtistSection = ({ owner = {}, loading }) => {
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
