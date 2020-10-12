import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { withRouter } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard/ProfileCard.js";

const useStyles = makeStyles((muiTheme) => ({}));

const ArtistSection = ({ owner = {}, loading }) => {
  const classes = useStyles();

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
