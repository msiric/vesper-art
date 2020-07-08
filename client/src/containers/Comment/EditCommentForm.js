import React from "react";
import { useFormik } from "formik";
import { TextField, Button } from "@material-ui/core";
import { commentValidation } from "../../validation/comment.js";
import AddArtworkStyles from "../../components/Artwork/AddArtwork.style.js";

const EditCommentForm = ({
  capabilities,
  user,
  postArtwork,
  postMedia,
  deleteEmptyValues,
}) => {
  const classes = AddArtworkStyles();

  const {
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
    touched,
    values,
    errors,
  } = useFormik({
    initialValues: {
      commentContent: comment.content,
    },
    enableReinitialize: true,
    validationSchema: commentValidation,
    async onSubmit(values) {
      await patchComment({
        artworkId: state.artwork._id,
        commentId: comment._id,
        data: values,
      });
      setState((prevState) => ({
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
      }));
      resetForm();
    },
  });

  <form className={classes.form} onSubmit={handleSubmit}>
    <div className={classes.editCommentForm}>
      <TextField
        name="commentContent"
        value={values.commentContent}
        onBlur={() => null}
        label="Edit comment"
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        helperText={touched.commentContent ? errors.commentContent : ""}
        error={touched.commentContent && Boolean(errors.commentContent)}
        margin="dense"
        variant="outlined"
        fullWidth
        multiline
      />
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
      <Button type="submit" color="primary" fullWidth disabled={isSubmitting}>
        Save
      </Button>
    </div>
  </form>;
};

export default EditCommentForm;
