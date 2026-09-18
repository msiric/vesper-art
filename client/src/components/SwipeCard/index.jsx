import React from "react";
import SwipeableViews from "react-swipeable-views";
import AppBar from "../../domain/AppBar";
import Box from "../../domain/Box";
import Tab from "../../domain/Tab";
import Tabs from "../../domain/Tabs";
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
            .filter((tab) => !!tab.display)
            .map((heading) => (
              <Tab
                key={heading.label}
                label={heading.label}
                {...heading.props}
              />
            ))}
        </Tabs>
      </AppBar>

      <SwipeableViews
        axis="x"
        index={tabs.value}
        onChangeIndex={(value) => handleTabsChange({ index: value })}
      >
        {tabs.items
          .filter((tab) => !!tab.display)
          .map((item, index) => (
            <Box
              key={item.component}
              className={`${classes.wrapper} ${
                tabs.value !== index && classes.hidden
              }`}
            >
              {item.loading || item.component ? item.component : item.error}
            </Box>
          ))}
      </SwipeableViews>
    </Box>
  );
};

export default SwipeCard;
