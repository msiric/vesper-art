import { useUserStore } from "@contexts/global/user";
import {
  CommentRounded as CommentIcon,
  DraftsRounded as ReadIcon,
  ErrorRounded as ErrorIcon,
  MarkunreadRounded as UnreadIcon,
  RateReviewRounded as ReviewIcon,
  ShoppingBasket as OrderIcon,
} from "@material-ui/icons";
import { formatDistance } from "date-fns";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../domain/Avatar";
import IconButton from "../../domain/IconButton";
import ListItem from "../../domain/ListItem";
import ListItemAvatar from "../../domain/ListItemAvatar";
import ListItemSecondaryAction from "../../domain/ListItemSecondaryAction";
import ListItemText from "../../domain/ListItemText";
import Typography from "../../domain/Typography";
import notificationItemStyles from "./styles";

const NotificationItem = ({
  notification,
  handleRedirectClick,
  handleReadClick,
  handleUnreadClick,
  closeMenu,
  isUpdating,
  loading,
}) => {
  const userId = useUserStore((state) => state.id);

  const classes = notificationItemStyles();

  const history = useHistory();

  const data = {
    label: "Error loading notification",
    link: null,
    icon: <ErrorIcon />,
  };

  if (notification?.type === "comment") {
    data.label = "A user left a comment on your artwork";
    data.link = `/artwork/${notification?.link}?notif=comment&ref=${notification?.ref}`;
    data.icon = <CommentIcon />;
  } else if (notification?.type === "order") {
    data.label = "A user ordered your artwork";
    data.link = `/orders/${notification?.link}?notif=order`;
    data.icon = <OrderIcon />;
  } else if (notification?.type === "review") {
    data.label = "A user left a review on your artwork";
    data.link = `/orders/${notification?.link}?notif=review`;
    data.icon = <ReviewIcon />;
  } else {
    data.label = "";
    data.link = "";
    data.icon = null;
  }

  return (
    <ListItem
      onClick={() =>
        !isUpdating &&
        handleRedirectClick({
          userId,
          notification,
          link: data.link,
          readNotification: handleReadClick,
          closeMenu,
          history,
        })
      }
      className={classes.item}
      disableRipple
    >
      <ListItemAvatar className={classes.avatar}>
        <Avatar
          className={notification?.read ? classes.read : classes.unread}
          loading={loading}
        >
          {data.icon}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        className={classes.listItem}
        primary={
          <Typography
            component={Link}
            to={data.link}
            className={classes.link}
            loading={loading}
          >
            {data.label || "Fetching content"}
          </Typography>
        }
        secondary={
          <Typography variant="caption" loading={loading}>
            {notification?.created
              ? `${formatDistance(
                  new Date(notification?.created),
                  new Date()
                )} ago`
              : "Fetching date"}
          </Typography>
        }
      />
      <ListItemSecondaryAction className={classes.icon}>
        <IconButton
          onClick={
            notification?.read
              ? (e) =>
                  handleUnreadClick({ userId, event: e, id: notification?.id })
              : (e) =>
                  handleReadClick({ userId, event: e, id: notification?.id })
          }
          edge="end"
          aria-label={notification?.read ? "Mark unread" : "Mark read"}
          disabled={isUpdating}
          loading={loading}
        >
          {notification?.read ? <ReadIcon /> : <UnreadIcon />}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default NotificationItem;
