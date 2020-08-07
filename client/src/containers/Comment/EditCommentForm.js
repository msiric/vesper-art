import { Button, TextField } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { patchComment } from '../../services/artwork.js';
import { commentValidation } from '../../validation/comment.js';

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
        await patchComment({
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
          <div className={classes.editCommentForm}>
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
          </div>
          <div className={classes.editCommentActions}>
            <Button
              type="button"
              color="primary"
              onClick={() => handleCommentClose(comment._id)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditCommentForm;
