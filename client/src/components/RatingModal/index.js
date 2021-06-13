import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { reviewValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import Backdrop from "../../domain/Backdrop";
import Box from "../../domain/Box";
import CardActions from "../../domain/CardActions";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import Fade from "../../domain/Fade";
import Modal from "../../domain/Modal";
import Typography from "../../domain/Typography";
import RatingForm from "../../forms/RatingForm";
import SyncButton from "../SyncButton/index.js";
import ratingModalStyles from "./styles";

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
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className={classes.content}>
          <Typography className={classes.title}>{promptTitle}</Typography>
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
              <CardActions className={classes.actions}>
                <AsyncButton
                  type="submit"
                  fullWidth
                  padding
                  submitting={formState.isSubmitting}
                  startIcon={<UploadIcon />}
                >
                  {promptConfirm}
                </AsyncButton>
                <SyncButton type="button" color="dark" onClick={handleClose}>
                  {promptCancel}
                </SyncButton>
              </CardActions>
            </form>
          </FormProvider>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RatingModal;
