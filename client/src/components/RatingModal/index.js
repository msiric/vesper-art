import { yupResolver } from "@hookform/resolvers/yup";
import {
  Backdrop,
  Box,
  Button,
  CardActions,
  CardContent,
  Divider,
  Fade,
  Modal,
  Typography,
} from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import AsyncButton from "../../components/AsyncButton/index.js";
import RatingForm from "../../forms/RatingForm";
import ratingModalStyles from "./styles";

const reviewValidation = Yup.object().shape({
  artistRating: Yup.number().min(1).max(5).required("Rating cannot be empty"),
});

const RatingModal = ({
  open,
  handleConfirm,
  handleClose,
  ariaLabel,
  promptTitle,
  promptConfirm,
  promptCancel,
  loading,
}) => {
  const {
    handleSubmit,
    formState,
    errors,
    control,
    setValue,
    trigger,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      artistRating: 0,
    },
    resolver: yupResolver(reviewValidation),
  });

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
          <FormProvider control={control}>
            <form onSubmit={handleSubmit(handleConfirm)}>
              <CardContent>
                <RatingForm
                  errors={errors}
                  setValue={setValue}
                  trigger={trigger}
                  getValues={getValues}
                  watch={watch}
                  loading={loading}
                />
              </CardContent>
              <CardActions
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <AsyncButton
                  type="submit"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  padding
                  loading={formState.isSubmitting}
                  startIcon={<UploadIcon />}
                >
                  {promptConfirm}
                </AsyncButton>
                <Button
                  type="button"
                  variant="outlined"
                  color="dark"
                  onClick={handleClose}
                >
                  {promptCancel}
                </Button>
              </CardActions>
            </form>
          </FormProvider>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RatingModal;
