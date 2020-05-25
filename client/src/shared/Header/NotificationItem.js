import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { NotificationsRounded as NotificationsIcon } from '@material-ui/icons';
import NotificationItemStyles from './NotificationItem.style';

const NotificationItem = ({ type, id }) => {
  const classes = NotificationItemStyles();

  const notification = {
    label: 'A user left a comment on your artwork',
    link: `/artwork/${id}`,
  };

  if (type === 'Comment') {
    notification.label = 'A user left a comment on your artwork';
    notification.link = `/artwork/${id}`;
  } else if (type === 'Order') {
    notification.label = 'A user ordered your artwork';
    notification.link = `/orders/${id}`;
  } else if (type === 'Review') {
    notification.label = 'A user left a review on your artwork';
    notification.link = `/orders/${id}`;
  } else {
    notification.label = null;
    notification.link = null;
  }

  return notification.label && notification.link ? (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <NotificationsIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography component={Link} to={notification.link}>
            {notification.label}
          </Typography>
        }
      />
    </ListItem>
  ) : null;
};

export default NotificationItem;
