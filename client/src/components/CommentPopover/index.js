import { Box, Button, Popover } from "@material-ui/core";
import {
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
} from "@material-ui/icons";
import React from "react";

const CommentPopover = ({
  artworkId,
  id,
  open,
  anchorEl,
  handleCommentOpen,
  handleCommentDelete,
  handlePopoverClose,
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      width={120}
      transition
    >
      <Box>
        <Button
          variant="text"
          startIcon={<EditIcon />}
          onClick={() => handleCommentOpen({ commentId: id })}
          fullWidth
        >
          Edit
        </Button>
        <Button
          variant="text"
          startIcon={<DeleteIcon />}
          onClick={() => handleCommentDelete({ artworkId, commentId: id })}
          fullWidth
        >
          Delete
        </Button>
      </Box>
    </Popover>
  );
};

export default CommentPopover;
