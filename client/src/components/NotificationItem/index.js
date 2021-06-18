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
import ListItemAvatar from "../../domain/ListItemAvatar";
import ListItemSecondaryAction from "../../domain/ListItemSecondaryAction";
import ListItemText from "../../domain/ListItemText";
import MenuItem from "../../domain/MenuItem";
import Typography from "../../domain/Typography";
import { artepunktTheme } from "../../styles/theme.js";
import notificationItemStyles from "./styles";

const NotificationItem = ({
  notification,
  handleRedirectClick,
  handleReadClick,
  handleUnreadClick,
  readNotification,
  toggleMenu,
  userId,
  isUpdating,
}) => {
  const classes = notificationItemStyles();

  const history = useHistory();

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
      <MenuItem
        onClick={(e) =>
          handleRedirectClick({
            event: e,
            notification,
            link: data.link,
            readNotification,
            toggleMenu,
            userId,
            history,
          })
        }
        className={classes.item}
        disableRipple
      >
        <ListItemAvatar>
          <Avatar
            style={{
              backgroundColor: notification.read
                ? ""
                : artepunktTheme.palette.primary.main,
            }}
          >
            {data.icon}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              component={Link}
              to={data.link}
              className={classes.link}
            >
              {data.label}
            </Typography>
          }
          secondary={
            <Typography variant="caption">
              {`${formatDistance(
                new Date(notification.created),
                new Date()
              )} ago`}
            </Typography>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={
              notification.read
                ? () => handleUnreadClick({ id: notification.id })
                : () => handleReadClick({ id: notification.id })
            }
            edge="end"
            aria-label={notification.read ? "Mark unread" : "Mark read"}
            disabled={isUpdating}
          >
            {notification.read ? <ReadIcon /> : <UnreadIcon />}
          </IconButton>
        </ListItemSecondaryAction>
      </MenuItem>
    </>
  ) : null;
};

export default NotificationItem;
