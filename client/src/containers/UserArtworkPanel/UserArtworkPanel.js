import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import SwipeCard from "../../components/SwipeCard/SwipeCard.js";
import ArtworkPanel from "../../containers/ArtworkPanel/ArtworkPanel.js";

const useStyles = makeStyles({
  paper: {
    minHeight: 300,
    height: "100%",
  },
  profileArtworkContainer: {
    "&> div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
  },
});

const UserArtworkPanel = ({
  tabs,
  user,
  loadMoreArtwork,
  loadMoreSaves,
  handleTabsChange,
  handleChangeIndex,
  loading,
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.grid}>
      <Paper className={classes.paper}>
        {user.editable ? (
          <SwipeCard
            tabs={{
              value: tabs.value,
              hasMore: "",
              type: "artwork",
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
                  iterable: true,
                  content: user.artwork.length,
                  component: (
                    <ArtworkPanel
                      elements={user.artwork}
                      hasMore={null}
                      loadMore={loadMoreArtwork}
                      type="artwork"
                      fixed={true}
                      loading={loading}
                    />
                  ),
                  error: "You have no artwork to display",
                  loading: false,
                },
                {
                  display: user.displaySaves,
                  iterable: true,
                  content: user.savedArtwork.length,
                  component: (
                    <ArtworkPanel
                      elements={user.savedArtwork}
                      hasMore={null}
                      loadMore={loadMoreSaves}
                      type="artwork"
                      fixed={true}
                      loading={loading}
                    />
                  ),
                  error: "You have no saved artwork",
                  loading: tabs.loading,
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
            loading={loading}
          />
        ) : (
          <SwipeCard
            tabs={{
              value: tabs.value,
              hasMore: "",
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
                  iterable: true,
                  content: user.artwork.length,
                  component: (
                    <ArtworkPanel
                      elements={user.artwork}
                      hasMore={null}
                      loadMore={loadMoreArtwork}
                      type="artwork"
                      fixed={true}
                      loading={loading}
                    />
                  ),
                  error: "This user has no artwork to display",
                  loading: false,
                },
                {
                  display: user.displaySaves,
                  iterable: true,
                  content: user.savedArtwork.length,
                  component: (
                    <ArtworkPanel
                      elements={user.savedArtwork}
                      hasMore={null}
                      loadMore={loadMoreSaves}
                      type="artwork"
                      fixed={true}
                      loading={loading}
                    />
                  ),
                  error: "This user has no saved artwork",
                  loading: tabs.loading,
                },
              ],
            }}
            handleTabsChange={handleTabsChange}
            handleChangeIndex={handleChangeIndex}
            loading={loading}
          />
        )}
      </Paper>
    </Grid>
  );
};

export default UserArtworkPanel;
