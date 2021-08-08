import React from "react";
import SwipeableViews from "react-swipeable-views";
import AppBar from "../../domain/AppBar";
import Box from "../../domain/Box";
import Tab from "../../domain/Tab";
import Tabs from "../../domain/Tabs";
import Typography from "../../domain/Typography";
import LoadingSpinner from "../LoadingSpinner";
import swipeCardStyles from "./styles";

const SwipeCard = ({ tabs, handleTabsChange, margin, loading }) => {
  const classes = swipeCardStyles();

  return (
    <Box className={classes.container} m={margin}>
      <AppBar position="static" color="inherit" className={classes.bar}>
        <Tabs
          value={tabs.value}
          onChange={(e, value) => handleTabsChange({ index: value })}
          indicatorColor="primary"
          textColor="primary"
          type="fullWidth"
          aria-label="Swipe card"
          loading={loading}
        >
          {tabs.headings
            .filter((tab) => tab.display === true)
            .map((heading) => (
              <Tab label={heading.label} {...heading.props} />
            ))}
        </Tabs>
      </AppBar>

      {!loading ? (
        <SwipeableViews
          axis="x"
          index={tabs.value}
          onChangeIndex={(value) => handleTabsChange({ index: value })}
        >
          {tabs.items
            .filter((tab) => tab.display === true)
            .map((item, index) => (
              <Box className={classes.wrapper} hidden={tabs.value !== index}>
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
      ) : (
        <LoadingSpinner />
      )}
    </Box>
  );
};

export default SwipeCard;
