import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Typography,
  Divider,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
  NotificationsRounded as NotificationsIcon,
  DraftsRounded as ReadIcon,
  MarkunreadRounded as UnreadIcon,
} from '@material-ui/icons';
import { ax } from '../../shared/Interceptor/Interceptor.js';
import NotificationItemStyles from './NotificationItem.style.js';

const NotificationItem = ({
  notification,
  handleReadClick,
  handleUnreadClick,
}) => {
  const classes = NotificationItemStyles();

  const data = {
    label: 'A user left a comment on your artwork',
    link: `/artwork/${notification.link}`,
  };

  if (notification.type === 'Comment') {
    data.label = 'A user left a comment on your artwork';
    data.link = `/artwork/${notification.link}`;
  } else if (notification.type === 'Order') {
    data.label = 'A user ordered your artwork';
    data.link = `/orders/${notification.link}`;
  } else if (notification.type === 'Review') {
    data.label = 'A user left a review on your artwork';
    data.link = `/orders/${notification.link}`;
  } else {
    data.label = null;
    data.link = null;
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
            <Typography component={Link} to={data.link}>
              {data.label}
            </Typography>
          }
          secondary={<Typography>{notification.created}</Typography>}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label={notification.read ? 'Mark unread' : 'Mark read'}
          >
            {notification.read ? (
              <ReadIcon onClick={() => handleUnreadClick(notification._id)} />
            ) : (
              <UnreadIcon onClick={() => handleReadClick(notification._id)} />
            )}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  ) : null;
};

export default NotificationItem;
