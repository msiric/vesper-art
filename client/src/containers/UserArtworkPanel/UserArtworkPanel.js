import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import SwipeCard from "../../components/SwipeCard/SwipeCard.js";

const useStyles = makeStyles({
  profile__bannerContainer: {},
});

const UserArtworkPanel = ({
  tabs,
  user,
  handleTabsChange,
  handleChangeIndex,
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={8} className={classes.grid}>
      {user.editable ? (
        <Paper className={classes.artwork} variant="outlined">
          <SwipeCard
            tabs={{
              value: tabs.value,
              headings: [
                { display: true, label: "User artwork", props: {} },
                { display: true, label: "Saved artwork", props: {} },
              ],
              items: [
                {
                  display: true,
                  content: user.artwork,
                  error: "You have no artwork to display",
                },
                {
                  display: true,
                  content: user.savedArtwork,
                  error: "You have no saved artwork",
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
          />
        </Paper>
      ) : (
        <Paper className={classes.artwork} variant="outlined">
          <SwipeCard
            tabs={{
              value: tabs.value,
              headings: [
                { display: true, label: "User artwork", props: {} },
                {
                  display: user.displaySaves,
                  label: "Saved artwork",
                  props: {},
                },
              ],
              items: [
                {
                  display: true,
                  content: user.artwork,
                  error: "This user has no artwork to display",
                },
                {
                  display: user.displaySaves,
                  content: user.savedArtwork,
                  error: "This user has no saved artwork",
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
          />
        </Paper>
      )}
    </Grid>
  );
};

export default UserArtworkPanel;
