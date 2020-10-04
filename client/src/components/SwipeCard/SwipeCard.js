import { AppBar, Box, Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.js";

const useStyles = makeStyles({
  profileArtworkContainer: {
    height: "100%",
    "&> div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "calc(100% - 48px)",
    },
    "&> div> div": {
      height: "100%",
      width: "100%",
    },
  },
  swipeCardBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});

const SwipeCard = ({ tabs, handleTabsChange, handleChangeIndex, margin }) => {
  const classes = useStyles();
  console.log(tabs);
  return (
    <Box className={classes.profileArtworkContainer} m={margin}>
      <AppBar position="static" color="transparent">
        <Tabs
          value={tabs.value}
          onChange={handleTabsChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="Swipe card"
        >
          {tabs.headings
            .filter((tab) => tab.display === true)
            .map((heading) => (
              <Tab label={heading.label} {...heading.props} />
            ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis="x"
        index={tabs.value}
        onChangeIndex={handleChangeIndex}
      >
        {tabs.items
          .filter((tab) => tab.display === true)
          .map((item, index) => (
            <Box className={classes.swipeCardBox} hidden={tabs.value !== index}>
              {item.loading ? (
                <LoadingSpinner />
              ) : item.iterable ? (
                item.content ? (
                  item.component
                ) : (
                  <Typography variant="h6" align="center">
                    {item.error}
                  </Typography>
                )
              ) : (
                item.component
              )}
            </Box>
          ))}
      </SwipeableViews>
    </Box>
  );
};

export default SwipeCard;
