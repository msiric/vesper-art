import Box from "@domain/Box";
import { FiberManualRecord as ItemDot } from "@material-ui/icons";
import React from "react";
import Avatar from "../../domain/Avatar";
import List from "../../domain/List";
import ListItem from "../../domain/ListItem";
import ListItemIcon from "../../domain/ListItemIcon";
import ListItemText from "../../domain/ListItemText";
import listItemsStyles from "./styles";

const ListItems = ({
  items,
  loading,
  custom = false,
  noPadding = false,
  ...props
}) => {
  const classes = listItemsStyles();

  return (
    <List disablePadding {...props}>
      {custom
        ? items.map((item) => item)
        : items.map((item) => (
            <ListItem className={noPadding && classes.item}>
              {loading ? (
                <Box className={classes.box}>
                  <Avatar loading={loading} className={classes.avatar} />
                </Box>
              ) : (
                <ListItemIcon className={!item.icon && classes.wrapper}>
                  {item.icon || <ItemDot className={classes.icon} />}
                </ListItemIcon>
              )}
              <ListItemText loading={loading} primary={item.label} />
            </ListItem>
          ))}
    </List>
  );
};

export default ListItems;
