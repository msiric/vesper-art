import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { MoreVertRounded as MoreIcon } from '@material-ui/icons';
import React, { useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useHistory } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.js';
import { List, Typography } from '../../constants/theme.js';
import { Context } from '../../context/Store.js';
import AddCommentForm from '../Comment/AddCommentForm.js';
import EditCommentForm from '../Comment/EditCommentForm.js';

const CommentSection = ({
  artwork,
  edits,
  scroll,
  loadMoreComments,
  handleCommentAdd,
  handleCommentEdit,
  handleCommentClose,
  handlePopoverOpen,
}) => {
  const [store, dispatch] = useContext(Context);
  const history = useHistory();
  const classes = {};

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography m={2} fontSize="h5.fontSize">
          Comments
        </Typography>
        <Divider />
        {artwork.comments.length ? (
          <InfiniteScroll
            style={{ overflow: 'hidden' }}
            className={classes.scroller}
            dataLength={artwork.comments.length}
            next={loadMoreComments}
            hasMore={scroll.comments.hasMore}
            loader={<LoadingSpinner />}
          >
            <List p={0}>
              {artwork.comments.map((comment) => (
                <Box key={comment._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={comment.owner.name}
                        src={comment.owner.photo}
                        component={Link}
                        to={`/user/${comment.owner.name}`}
                        className={classes.noLink}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        edits[comment._id]
                          ? null
                          : [
                              <Typography
                                component={Link}
                                to={`/user/${comment.owner.name}`}
                                style={{ textDecoration: 'none' }}
                                color="text.primary"
                              >
                                {comment.owner.name}
                              </Typography>,
                              <Typography
                                component="span"
                                color="text.secondary"
                                fontStyle="oblique"
                                ml={1}
                              >
                                {comment.modified ? 'edited' : null}
                              </Typography>,
                            ]
                      }
                      secondary={
                        edits[comment._id] ? (
                          <EditCommentForm
                            comment={comment}
                            artwork={artwork}
                            handleCommentEdit={handleCommentEdit}
                            handleCommentClose={handleCommentClose}
                          />
                        ) : (
                          <Typography>{comment.content}</Typography>
                        )
                      }
                    />
                    {edits[comment._id] ||
                    comment.owner._id !== store.user.id ? null : (
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={(e) => handlePopoverOpen(e, comment._id)}
                          edge="end"
                          aria-label="More"
                        >
                          <MoreIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>
          </InfiniteScroll>
        ) : (
          <Box
            height={70}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={-2}
          >
            <Typography>No comments</Typography>
          </Box>
        )}
        <AddCommentForm artwork={artwork} handleCommentAdd={handleCommentAdd} />
      </CardContent>
    </Card>
  );
};

export default CommentSection;
