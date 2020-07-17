import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import SwipeCard from "../../components/SwipeCard/SwipeCard.js";

const useStyles = makeStyles({
  profile__bannerContainer: {},
});

const UserProfileBanner = () => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={8} className={classes.grid}>
      {state.user.editable ? (
        <Paper className={classes.artwork} variant="outlined">
          <SwipeCard
            tabs={{
              value: state.tabs.value,
              headings: [
                { display: true, label: "User artwork", props: {} },
                { display: true, label: "Saved artwork", props: {} },
              ],
              items: [
                {
                  display: true,
                  content: state.user.artwork,
                  error: "You have no artwork to display",
                },
                {
                  display: true,
                  content: state.user.savedArtwork,
                  error: "You have no saved artwork",
                },
              ],
            }}
          />
        </Paper>
      ) : (
        <Paper className={classes.artwork} variant="outlined">
          <SwipeCard
            tabs={{
              value: state.tabs.value,
              headings: [
                { display: true, label: "User artwork", props: {} },
                {
                  display: state.user.displaySaves,
                  label: "Saved artwork",
                  props: {},
                },
              ],
              items: [
                {
                  display: true,
                  content: state.user.artwork,
                  error: "This user has no artwork to display",
                },
                {
                  display: state.user.displaySaves,
                  content: state.user.savedArtwork,
                  error: "This user has no saved artwork",
                },
              ],
            }}
          />
        </Paper>
      )}
    </Grid>
  );
};

export default UserProfileBanner;
