import React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import { commentValidation } from '../../validation/comment.js';
import { patchComment } from '../../services/artwork.js';

const EditCommentForm = ({ comment, artwork, handleCommentClose }) => {
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
        /*       setState((prevState) => ({
          ...prevState,
          artwork: {
            ...prevState.artwork,
            comments: prevState.artwork.comments.map((item) =>
              item._id === comment._id
                ? {
                    ...item,
                    content: values.commentContent,
                    modified: true,
                  }
                : item
            ),
          },
          edits: {
            ...prevState.edits,
            [comment._id]: false,
          },
        })); */
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
