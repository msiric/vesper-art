import { Box, Button, TextField } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React, { useContext } from 'react';
import { Context } from '../../context/Store.js';
import { postComment } from '../../services/artwork.js';
import { commentValidation } from '../../validation/comment.js';

const AddCommentForm = ({ artwork, handleCommentAdd }) => {
  const [store, dispatch] = useContext(Context);
  const classes = {};

  return (
    <Formik
      initialValues={{
        commentContent: '',
      }}
      enableReinitialize={true}
      validationSchema={commentValidation}
      onSubmit={async (values, { resetForm }) => {
        const { data } = await postComment({
          artworkId: artwork._id,
          data: values,
        });
        handleCommentAdd(data.payload);
        resetForm();
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className={classes.card}>
          <Box m={2}>
            <Field name="commentContent">
              {({ field, form: { touched, errors }, meta }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Type a comment"
                  onBlur={() => null}
                  helperText={meta.touched && meta.error}
                  error={meta.touched && Boolean(meta.error)}
                  margin="dense"
                  variant="outlined"
                  fullWidth
                />
              )}
            </Field>
          </Box>
          <Box m={2}>
            <Button
              type="submit"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              Post
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddCommentForm;
