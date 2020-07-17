import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import { Box, AppBar, Tabs, Tab, Typography } from "@material-ui/core";

const useStyles = makeStyles({ profileArtworkContainer: { height: "100%" } });

const SwipeCard = ({ tabs, handleTabsChange, handleChangeIndex }) => {
  const classes = useStyles();

  return (
    <Box className={classes.profileArtworkContainer}>
      <AppBar position="static" color="default">
        <Tabs
          value={tabs.value}
          onChange={handleTabsChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="Swipe card"
        >
          {tabs.headings.map((heading) =>
            heading.display ? (
              <Tab label={heading.label} {...heading.props} />
            ) : null
          )}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis="x"
        index={tabs.value}
        onChangeIndex={handleChangeIndex}
      >
        {tabs.items.map((item, index) =>
          item.display ? (
            <Box hidden={tabs.value !== index}>
              {item.content.length ? (
                "s"
              ) : (
                <Typography variant="h6" align="center">
                  {item.error}
                </Typography>
              )}
            </Box>
          ) : null
        )}
      </SwipeableViews>
    </Box>
  );
};

export default SwipeCard;
