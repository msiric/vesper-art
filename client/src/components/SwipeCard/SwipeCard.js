import React from 'react';
import { Box, AppBar, Tabs, Tab, Typography } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles } from '@material-ui/core/styles';
import ArtworkPanel from '../../containers/ArtworkPanel/ArtworkPanel.js';

const useStyles = makeStyles({
  profileArtworkContainer: {
    height: '100%',
    '&> div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100% - 48px)',
    },
  },
});

const SwipeCard = ({
  tabs,
  handleTabsChange,
  handleChangeIndex,
  handleLoadMore,
}) => {
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
                <ArtworkPanel
                  elements={item.content}
                  hasMore={item.hasMore}
                  loadMore={handleLoadMore}
                  type={item.type}
                />
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
