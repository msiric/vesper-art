import React from "react";
import Avatar from "../../domain/Avatar";
import List from "../../domain/List";
import ListItem from "../../domain/ListItem";
import ListItemIcon from "../../domain/ListItemIcon";
import ListItemText from "../../domain/ListItemText";
import listItemsStyles from "./styles";

const ListItems = ({ items, loading, custom = false, ...props }) => {
  const classes = listItemsStyles();

  return (
    <List disablePadding {...props}>
      {custom
        ? items.map((item) => item)
        : items.map((item) => (
            <ListItem>
              {loading ? (
                <Avatar loading={loading} className={classes.icon} />
              ) : (
                <ListItemIcon>{item.icon}</ListItemIcon>
              )}
              <ListItemText loading={loading} primary={item.label} />
            </ListItem>
          ))}
    </List>
  );
};

export default ListItems;
