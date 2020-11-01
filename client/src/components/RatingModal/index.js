import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Modal,
  Typography,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import ratingModalStyles from "./styles";

const reviewValidation = Yup.object().shape({
  rating: Yup.number().min(1).max(5).required("Rating cannot be empty"),
});

const RatingModal = ({
  open,
  handleConfirm,
  handleClose,
  ariaLabel,
  promptTitle,
  promptConfirm,
  promptCancel,
}) => {
  const classes = ratingModalStyles();

  return (
    <Modal
      aria-labelledby={ariaLabel}
      aria-describedby={ariaLabel}
      className={classes.modalWrapper}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className={classes.modalContent}>
          <Typography className={classes.modalTitle}>{promptTitle}</Typography>
          <Divider />
          <Formik
            initialValues={{
              rating: 0,
            }}
            enableReinitialize
            validationSchema={reviewValidation}
            onSubmit={handleConfirm}
          >
            {({ values, errors, touched }) => (
              <Form>
                <Box className={classes.ratingContainer}>
                  <Field name="rating">
                    {({
                      field,
                      form: { touched, errors, setFieldValue },
                      meta,
                    }) => <Rating {...field} size="large" />}
                  </Field>
                </Box>
                <Box className={classes.modalActions}>
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    onClick={handleConfirm}
                  >
                    {promptConfirm}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    color="dark"
                    onClick={handleClose}
                  >
                    {promptCancel}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RatingModal;
