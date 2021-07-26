import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index";

const CommentForm = ({ errors, loading }) => {
  const classes = {};

  return (
    <Box>
      <TextInput
        name="commentContent"
        type="text"
        label="Add a comment"
        errors={errors}
        loading={loading}
      />
    </Box>
  );
};

export default CommentForm;
