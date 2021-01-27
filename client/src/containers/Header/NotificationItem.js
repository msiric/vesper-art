import {
  Avatar,
  IconButton,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
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
import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../../common/helpers.js";
import { useTracked as useEventsContext } from "../../contexts/global/Events.js";
import { artepunktTheme } from "../../styles/theme.js";
import NotificationItemStyles from "./NotificationItem.style.js";

const NotificationItem = ({
  notification,
  handleRedirectClick,
  handleReadClick,
  handleUnreadClick,
}) => {
  const [eventsStore] = useEventsContext();
  const classes = NotificationItemStyles();

  const data = {
    label: "Error loading notification",
    link: null,
    icon: <ErrorIcon />,
  };

  if (notification.type === "comment") {
    data.label = "A user left a comment on your artwork";
    data.link = `/artwork/${notification.link}?notif=comment&ref=${notification.ref}`;
    data.icon = <CommentIcon color={notification.read ? "" : "primary"} />;
  } else if (notification.type === "order") {
    data.label = "A user ordered your artwork";
    data.link = `/orders/${notification.link}?notif=order`;
    data.icon = <OrderIcon color={notification.read ? "" : "primary"} />;
  } else if (notification.type === "review") {
    data.label = "A user left a review on your artwork";
    data.link = `/orders/${notification.link}?notif=review`;
    data.icon = <ReviewIcon color={notification.read ? "" : "primary"} />;
  }

  return data.label && data.link ? (
    <>
      <MenuItem
        onClick={() => handleRedirectClick(notification, data.link)}
        style={{
          cursor: "pointer",
          width: "100%",
          backgroundColor:
            !notification.read &&
            artepunktTheme.palette.background.notification,
        }}
        disableRipple
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
                ? () => handleUnreadClick(notification.id)
                : () => handleReadClick(notification.id)
            }
            edge="end"
            aria-label={notification.read ? "Mark unread" : "Mark read"}
            disabled={eventsStore.notifications.isSubmitting}
          >
            {notification.read ? <ReadIcon /> : <UnreadIcon />}
          </IconButton>
        </ListItemSecondaryAction>
      </MenuItem>
    </>
  ) : null;
};

export default NotificationItem;
