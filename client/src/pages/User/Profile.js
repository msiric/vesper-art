import { withSnackbar } from "notistack";
import React, { useEffect, useRef } from "react";
import ProfileArtwork from "../../containers/ProfileArtwork/index";
import ProfileInfo from "../../containers/ProfileInfo/index";
import { useUserArtwork } from "../../contexts/local/userArtwork";
import { useUserProfile } from "../../contexts/local/userProfile";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";
import { containsErrors, renderError } from "../../utils/helpers";

const Profile = ({ match, location }) => {
  const retry = useUserProfile((state) => state.profile.error.retry);
  const redirect = useUserProfile((state) => state.profile.error.redirect);
  const message = useUserProfile((state) => state.profile.error.message);
  const resetProfile = useUserProfile((state) => state.resetProfile);
  const resetArtwork = useUserArtwork((state) => state.resetArtwork);
  const paramId = match.params.id;
  const artworkFetched = useRef(false);
  const artworkRef = useRef(null);

  const reinitializeState = () => {
    resetProfile();
    resetArtwork();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  const globalClasses = globalStyles();

  return !containsErrors(retry, redirect) ? (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <>
          <ProfileInfo paramId={paramId} />
          <ProfileArtwork
            paramId={paramId}
            artworkRef={artworkRef}
            artworkFetched={artworkFetched}
          />
        </>
      </Grid>
    </Container>
  ) : (
    renderError({ retry, redirect, message })
  );
};

export default withSnackbar(Profile);
