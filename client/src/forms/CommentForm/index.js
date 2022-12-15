import { Box } from "@material-ui/core";
import React from "react";
import TextInput from "../../controls/TextInput/index";

const CommentForm = ({ getValues, errors, loading }) => {
  return (
    <Box>
      <TextInput
        value={getValues("commentContent")}
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
