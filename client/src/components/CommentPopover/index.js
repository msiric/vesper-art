import {
  DeleteRounded as DeleteIcon,
  EditRounded as EditIcon,
} from "@material-ui/icons";
import React from "react";
import Box from "../../domain/Box";
import Button from "../../domain/Button";
import Popover from "../../domain/Popover";
import commentPopoverStyles from "./styles";

const CommentPopover = ({
  id,
  open,
  anchorEl,
  handleCommentOpen,
  handleModalOpen,
  handlePopoverClose,
}) => {
  const classes = commentPopoverStyles();

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
      transition
      className={classes.popover}
    >
      <Box>
        <Button
          outline="text"
          startIcon={<EditIcon />}
          onClick={() => handleCommentOpen({ commentId: id })}
          fullWidth
        >
          Edit
        </Button>
        <Button
          outline="text"
          startIcon={<DeleteIcon />}
          onClick={() => handleModalOpen({ commentId: id })}
          fullWidth
        >
          Delete
        </Button>
      </Box>
    </Popover>
  );
};

export default CommentPopover;
