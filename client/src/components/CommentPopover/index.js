import {
  DeleteOutlineRounded as DeleteIcon,
  EditOutlined as EditIcon,
} from "@material-ui/icons";
import React from "react";
import Box from "../../domain/Box";
import Popover from "../../domain/Popover";
import SyncButton from "../SyncButton";
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
        <SyncButton
          color="secondary"
          outline="text"
          startIcon={<EditIcon />}
          onClick={() => handleCommentOpen({ commentId: id })}
          fullWidth
        >
          Edit
        </SyncButton>
        <SyncButton
          outline="text"
          startIcon={<DeleteIcon />}
          onClick={() => handleModalOpen({ commentId: id })}
          fullWidth
        >
          Delete
        </SyncButton>
      </Box>
    </Popover>
  );
};

export default CommentPopover;
