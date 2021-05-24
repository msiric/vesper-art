import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import listItemsStyles from "./styles.js";

const ListItems = ({ items, loading, ...props }) => {
  const classes = listItemsStyles();

  return (
    <List disablePadding {...props}>
      {items.map((item) => (
        <ListItem>
          <SkeletonWrapper
            variant="circle"
            loading={loading}
            style={{ marginRight: 10 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
          </SkeletonWrapper>
          <SkeletonWrapper variant="text" loading={loading}>
            <ListItemText primary={item.label} />
          </SkeletonWrapper>
        </ListItem>
      ))}
    </List>
  );
};

export default ListItems;
