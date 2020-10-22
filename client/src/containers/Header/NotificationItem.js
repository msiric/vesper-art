import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import {
  CommentRounded as CommentIcon,
  DraftsRounded as ReadIcon,
  ErrorRounded as ErrorIcon,
  MarkunreadRounded as UnreadIcon,
  RateReviewRounded as ReviewIcon,
  ShoppingBasket as OrderIcon,
} from "@material-ui/icons";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
import { EventsContext } from "../../contexts/Events.js";
import NotificationItemStyles from "./NotificationItem.style.js";

const NotificationItem = ({
  notification,
  handleRedirectClick,
  handleReadClick,
  handleUnreadClick,
}) => {
  const [eventsStore] = useContext(EventsContext);
  const classes = NotificationItemStyles();

  const data = {
    label: "Error loading notification",
    link: null,
    icon: <ErrorIcon />,
  };

  if (notification.type === "comment") {
    data.label = "A user left a comment on your artwork";
    data.link = `/artwork/${notification.link}?notif=comment&ref=${notification.ref}`;
    data.icon = <CommentIcon />;
  } else if (notification.type === "order") {
    data.label = "A user ordered your artwork";
    data.link = `/orders/${notification.link}?notif=order`;
    data.icon = <OrderIcon />;
  } else if (notification.type === "review") {
    data.label = "A user left a review on your artwork";
    data.link = `/orders/${notification.link}?notif=review`;
    data.icon = <ReviewIcon />;
  }

  return data.label && data.link ? (
    <>
      <ListItem
        onClick={() => handleRedirectClick(notification, data.link)}
        style={{ cursor: "pointer", width: "100%" }}
      >
        <ListItemAvatar>
          <Avatar>{data.icon}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              component={Link}
              to={data.link}
              style={{
                fontWeight: "bold",
                color: "white",
                textDecoration: "none",
              }}
            >
              {data.label}
            </Typography>
          }
          secondary={
            <Typography variant="caption">
              {formatDate(new Date(notification.created), "dd/MM/yyyy HH:mm")}
            </Typography>
          }
          style={{ paddingRight: 32 }}
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
            disabled={eventsStore.notifications.isSubmitting}
          >
            {notification.read ? <ReadIcon /> : <UnreadIcon />}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </>
  ) : null;
};

export default NotificationItem;
