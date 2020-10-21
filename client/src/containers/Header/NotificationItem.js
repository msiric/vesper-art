import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import {
  DraftsRounded as ReadIcon,
  MarkunreadRounded as UnreadIcon,
  NotificationsRounded as NotificationsIcon,
} from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
import NotificationItemStyles from "./NotificationItem.style.js";

const NotificationItem = ({
  notification,
  handleRedirectClick,
  handleReadClick,
  handleUnreadClick,
}) => {
  const classes = NotificationItemStyles();

  const data = {
    label: null,
    link: null,
  };

  if (notification.type === "comment") {
    data.label = "A user left a comment on your artwork";
    data.link = `/artwork/${notification.link}?notif=comment&ref=${notification.ref}`;
  } else if (notification.type === "order") {
    data.label = "A user ordered your artwork";
    data.link = `/orders/${notification.link}?notif=order`;
  } else if (notification.type === "review") {
    data.label = "A user left a review on your artwork";
    data.link = `/orders/${notification.link}?notif=review`;
  }

  return data.label && data.link ? (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <NotificationsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              component={Link}
              to={data.link}
              onClick={() => handleRedirectClick(notification, data.link)}
              color="primary"
            >
              {data.label}
            </Typography>
          }
          secondary={
            <Typography>
              {formatDate(new Date(notification.created), "dd/MM/yyyy HH:mm")}
            </Typography>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={
              notification.read
                ? () => handleUnreadClick(notification._id)
                : () => handleReadClick(notification._id)
            }
            edge="end"
            aria-label={notification.read ? "Mark unread" : "Mark read"}
          >
            {notification.read ? <ReadIcon /> : <UnreadIcon />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  ) : null;
};

export default NotificationItem;
