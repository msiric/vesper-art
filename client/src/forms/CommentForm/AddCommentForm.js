import { Box, Button, TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React from "react";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { postComment } from "../../services/artwork.js";
import { commentValidation } from "../../validation/comment.js";

const AddCommentForm = ({ artwork, handleCommentAdd, loading }) => {
  const classes = {};

  return (
    <Formik
      initialValues={{
        commentContent: "",
      }}
      enableReinitialize={true}
      validationSchema={commentValidation}
      onSubmit={async (values, { resetForm }) => {
        const { data } = await postComment.request({
          artworkId: artwork._id,
          data: values,
        });
        handleCommentAdd(data.payload);
        resetForm();
      }}
    >
      {({ values, errors, touched, isSubmitting }) => (
        <Form className={classes.card}>
          <Box>
            <SkeletonWrapper variant="text" loading={loading} width="100%">
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
            </SkeletonWrapper>
          </Box>
          <Box>
            <SkeletonWrapper loading={loading} width="100%">
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                fullWidth
                disabled={isSubmitting}
              >
                Post
              </Button>
            </SkeletonWrapper>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddCommentForm;
