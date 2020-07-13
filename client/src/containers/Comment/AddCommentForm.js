/* import React from "react";
import { useFormik } from "formik";
import { TextField, Button } from "@material-ui/core";
import { commentValidation } from "../../validation/comment.js";
import AddArtworkStyles from "../../components/Artwork/AddArtwork.style.js";

const AddCommentForm = ({
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
      commentContent: "",
    },
    enableReinitialize: true,
    validationSchema: commentValidation,
    async onSubmit(values) {
      const { data } = await postComment({
        artworkId: state.artwork._id,
        data: values,
      });
      setState((prevState) => ({
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
      }));
      resetForm();
    },
  });

  <form className={classes.postComment} onSubmit={handleSubmit}>
    <div className={classes.editCommentForm}>
      <TextField
        name="commentContent"
        value={values.commentContent}
        onBlur={() => null}
        label="Type a comment"
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
      <Button type="submit" color="primary" fullWidth disabled={isSubmitting}>
        Post
      </Button>
    </div>
  </form>;
};

export default AddCommentForm;
 */
