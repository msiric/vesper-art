import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import listItemsStyles from "./styles.js";

const ListItems = ({ items, loading, ...props }) => {
  const classes = listItemsStyles();

  return (
    <List disablePadding {...props}>
      {items.map((item) => (
        <ListItem>
          {loading ? (
            <SkeletonWrapper
              className={classes.listItemsLoader}
              variant="circle"
              loading={loading}
            >
              <Avatar className={classes.listItemsIcon} />
            </SkeletonWrapper>
          ) : (
            <ListItemIcon>{item.icon}</ListItemIcon>
          )}
          <SkeletonWrapper variant="text" loading={loading}>
            <ListItemText primary={item.label} />
          </SkeletonWrapper>
        </ListItem>
      ))}
    </List>
  );
};

export default ListItems;
