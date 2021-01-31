import { AppBar, Box, Tab, Tabs, Typography } from "@material-ui/core";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import LoadingSpinner from "../LoadingSpinner";
import SkeletonWrapper from "../SkeletonWrapper/index";
import swipeCardStyles from "./styles";

const SwipeCard = ({
  tabs,
  handleTabsChange,
  handleChangeIndex,
  margin,
  loading,
}) => {
  const classes = swipeCardStyles();

  return (
    <Box className={classes.profileArtworkContainer} m={margin}>
      <AppBar
        position="static"
        color="transparent"
        style={{ marginBottom: 10 }}
      >
        <SkeletonWrapper loading={loading} width="100%" height="100%">
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
        </SkeletonWrapper>
      </AppBar>

      {!loading ? (
        <SwipeableViews
          axis="x"
          index={tabs.value}
          onChangeIndex={handleChangeIndex}
        >
          {tabs.items
            .filter((tab) => tab.display === true)
            .map((item, index) => (
              <Box
                className={classes.swipeCardBox}
                hidden={tabs.value !== index}
              >
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
