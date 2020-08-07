import {
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { MoreVertRounded as MoreIcon } from '@material-ui/icons';
import React, { useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useHistory } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner.js';
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
        <Typography gutterBottom variant="h5" component="h2">
          Comments
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {artwork.comments.length ? (
            <InfiniteScroll
              style={{ overflow: 'hidden' }}
              className={classes.scroller}
              dataLength={artwork.comments.length}
              next={loadMoreComments}
              hasMore={scroll.comments.hasMore}
              loader={<LoadingSpinner />}
            >
              <List className={classes.root}>
                {artwork.comments.map((comment) => (
                  <React.Fragment key={comment._id}>
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
                                  className={`${classes.fonts} ${classes.noLink}`}
                                  style={{ textDecoration: 'none' }}
                                  color="primary"
                                >
                                  {comment.owner.name}
                                </Typography>,
                                <Typography
                                  className={classes.modified}
                                  component="span"
                                  style={{ marginLeft: 10 }}
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
                  </React.Fragment>
                ))}
              </List>
            </InfiniteScroll>
          ) : (
            <p>No comments</p>
          )}
          <AddCommentForm
            artwork={artwork}
            handleCommentAdd={handleCommentAdd}
          />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
