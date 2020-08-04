import React, { useContext } from 'react';
import { Context } from '../../context/Store.js';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import { commentValidation } from '../../validation/comment.js';
import { postComment } from '../../services/artwork.js';

const AddCommentForm = ({ artwork }) => {
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
        /*       setState((prevState) => ({
          ...prevState,
          artwork: {
            ...prevState.artwork,
            comments: [
              ...prevState.artwork.comments,
              {
                ...data.payload,
                owner: {
                  _id: store.user.id,
                  name: store.user.name,
                  photo: store.user.photo,
                },
              },
            ],
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
                  label="Type a comment"
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
              type="submit"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              Post
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddCommentForm;
