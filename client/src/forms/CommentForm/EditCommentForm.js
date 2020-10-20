import { Box, Button, TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React from "react";
import { patchComment } from "../../services/artwork.js";
import { commentValidation } from "../../validation/comment.js";

const EditCommentForm = ({
  comment,
  artwork,
  handleCommentEdit,
  handleCommentClose,
}) => {
  const classes = {};

  return (
    <Formik
      initialValues={{
        commentContent: comment.content,
      }}
      validationSchema={commentValidation}
      onSubmit={async (values, { resetForm }) => {
        await patchComment.request({
          artworkId: artwork._id,
          commentId: comment._id,
          data: values,
        });
        handleCommentEdit(comment._id, values.commentContent);
        resetForm();
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className={classes.card}>
          <Box className={classes.editCommentForm}>
            <Field name="commentContent">
              {({ field, form: { touched, errors }, meta }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Edit comment"
                  helperText={meta.touched && meta.error}
                  error={meta.touched && Boolean(meta.error)}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                />
              )}
            </Field>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              disabled={isSubmitting}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="warning"
              onClick={() => handleCommentClose(comment._id)}
            >
              Cancel
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default EditCommentForm;
